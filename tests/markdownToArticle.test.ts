/**
 * @jest-environment node
 */

import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { generateObject } from 'ai';
import { LanguageModelV1 } from '@ai-sdk/provider';
import { getModel } from '@/lib/utils/modelUtils';
import { PrismaClient } from '@prisma/client';
import { slugify } from '@/lib/utils/slugify';
import { WordPressClient } from '@/lib/wordpress/wordpressClient';
import { WordPressPost } from '@/lib/wordpress/wordpressTypes';
import { getOrCreateTestUser } from './test-helpers';

const prisma = new PrismaClient();

// Create WordPress client
const wpClient = new WordPressClient({
  baseUrl: process.env.WORDPRESS_URL || '',
  username: process.env.WORDPRESS_USERNAME || '',
  password: process.env.WORDPRESS_PASSWORD || '',
});

const ArticleSchema = z.object({
  title: z.string().describe("A clear, concise title for the article. i.e. Meta-Analysis of X for Dementia"),
  description: z.string().describe("A brief summary of the article content."),
  content: z.string().describe(`
    nicely format this markdown content with appropriate headers, bullet points, and sections.
    Fix any formatting issues or weirdness.

    Make sure to preserve all useful information, including any links to external sources or data. 
    `),
  categoryName: z.string().describe("The main category this article belongs to. i.e. Dementia Treatments"),
  tags: z.array(z.string()).describe("relevant tags for the article. i.e. dementia, meta-analysis, X"),
});

type GeneratedArticle = z.infer<typeof ArticleSchema>;

async function convertMarkdownToArticle(mdPath: string): Promise<string> {
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const model: LanguageModelV1 = getModel();

  const prompt = `
    Please nicely format this markdown content with appropriate headers, bullet points, and sections.
    Fix any formatting issues or weirdness.

    Make sure to preserve all useful information, including any links to external sources or data. 
    
    Original content to be formatted:
    ${mdContent}
  `;

  const result = await generateObject({
    model,
    schema: ArticleSchema,
    prompt,
  });

  const article = result.object as GeneratedArticle;
  article.categoryName = "Dementia Treatments";
  const slug = slugify(article.title);

  // Find or create category
  let category = await prisma.articleCategory.findFirst({
    where: {
      name: {
        equals: article.categoryName,
        mode: 'insensitive',
      },
    },
  });

  if (!category) {
    category = await prisma.articleCategory.create({
      data: {
        name: article.categoryName,
        slug: slugify(article.categoryName),
      },
    });
  }

  // Create tags
  const tagObjects = await Promise.all(
    article.tags.map(async (tagName) => {
      const existingTag = await prisma.articleTag.findFirst({
        where: { name: { equals: tagName, mode: 'insensitive' } },
      });

      if (existingTag) {
        return existingTag;
      } else {
        return prisma.articleTag.create({
          data: { name: tagName, slug: slugify(tagName) },
        });
      }
    })
  );

  // Create or find system user
  let systemUser = await getOrCreateTestUser();

  // Save article to database with valid user ID
  const savedArticle = await prisma.article.create({
    data: {
      title: article.title,
      slug,
      description: article.description,
      content: article.content,
      status: 'DRAFT',
      visibility: 'PUBLIC',
      categoryId: category.id,
      userId: systemUser.id, // Use the actual user ID instead of 'system' string
      tags: {
        connect: tagObjects.map((tag) => ({ id: tag.id })),
      },
    },
  });

  // Create WordPress post
  const wpPost: WordPressPost = {
    title: article.title,
    content: article.content,
    excerpt: article.description,
    tags: article.tags,
    categories: [article.categoryName],
    format: 'markdown'
  };

  try {
    await wpClient.createPost(wpPost);
  } catch (error) {
    console.error('Failed to create WordPress post:', error);
  }

  // Generate output path and save JSON
  const articlesDir = path.join(process.cwd(), 'articles_output');
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }

  const articleFileName = path.basename(mdPath, '.md') + '.json';
  const articlePath = path.join(articlesDir, articleFileName);

  fs.writeFileSync(
    articlePath, 
    JSON.stringify({
      ...article,
      slug,
      id: savedArticle.id,
      categoryId: category.id,
    }, null, 2),
    'utf8'
  );

  return articlePath;
}

describe('Markdown to Article Converter Tests', () => {
  const mdDir = path.join(process.cwd(), 'markdown_output');
  const articlesDir = path.join(process.cwd(), 'articles_output');

  beforeAll(async () => {
    // Clean up database before tests
    //await prisma.article.deleteMany();
    //await prisma.articleTag.deleteMany();
    //await prisma.articleCategory.deleteMany();
    
    if (!fs.existsSync(mdDir)) {
      throw new Error('Markdown directory not found. Run HTML to Markdown conversion tests first.');
    }

    if (fs.existsSync(articlesDir)) {
      //fs.rmSync(articlesDir, { recursive: true, force: true });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should convert all markdown files to structured articles', async () => {
    const mdFiles = fs.readdirSync(mdDir)
      .filter(file => file.toLowerCase().endsWith('.md'))
      .map(file => path.join(mdDir, file));

    expect(mdFiles.length).toBeGreaterThan(0);
    console.log(`Found ${mdFiles.length} markdown files to convert`);

    for (const mdFile of mdFiles) {
      console.log(`Converting ${mdFile} to article...`);
      const articlePath = await convertMarkdownToArticle(mdFile);

      // Verify the article file exists and has content
      expect(fs.existsSync(articlePath)).toBe(true);
      const articleContent = fs.readFileSync(articlePath, 'utf8');
      const article = JSON.parse(articleContent) as GeneratedArticle;

      // Validate article structure
      expect(article.title).toBeTruthy();
      expect(article.description).toBeTruthy();
      expect(article.content).toBeTruthy();
      expect(article.categoryName).toBeTruthy();
      expect(Array.isArray(article.tags)).toBe(true);
      expect(article.tags.length).toBeGreaterThanOrEqual(5);
      expect(article.tags.length).toBeLessThanOrEqual(10);

      // Verify content formatting
      expect(article.content).toMatch(/^#+ /m); // Should have at least one heading

      console.log(`Successfully converted: ${mdFile} to ${articlePath}`);
      console.log('Generated article:', {
        title: article.title,
        category: article.categoryName,
        tags: article.tags,
        descriptionPreview: article.description.slice(0, 100) + '...'
      });
    }
  }, 1200000); // 20-minute timeout

  afterAll(() => {
    // Commented out to allow manual inspection of results
    // if (fs.existsSync(articlesDir)) {
    //   fs.rmSync(articlesDir, { recursive: true, force: true });
    // }
  });
}); 