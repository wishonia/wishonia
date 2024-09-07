import { z } from 'zod';
import { generateObject } from 'ai';
import { getSearchResults } from "@/lib/agents/researcher/getSearchResults";
import { generateSearchQueries } from "@/lib/agents/researcher/searchQueryGenerator";
import {anthropic} from "@ai-sdk/anthropic";
import {openai} from "@ai-sdk/openai";
import {google} from "@ai-sdk/google";
import {LanguageModelV1} from "@ai-sdk/provider";
import {SearchResult} from "exa-js";
import { PrismaClient, Article } from '@prisma/client';
import { slugify } from '@/lib/utils/slugify'; // Assuming you have a slugify utility

const prisma = new PrismaClient();

const GeneratedReportSchema = z.object({
  title: z.string().describe('The title of the report'),
  description: z.string().describe('A brief description or summary of the report'),
  content: z.string().describe('The main content of the report in markdown format. DO NOT include the title.'),
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    description: z.string(),
  })).describe('An array of sources used in the report'),
  tags: z.array(z.string()).describe('Relevant tags for the report'),
  categoryName: z.string().describe('The main category of the report'),
});

type GeneratedReport = z.infer<typeof GeneratedReportSchema>;

export type ReportOutput = GeneratedReport & {
  searchResults: SearchResult[];
  featuredImage?: string;
  generationOptions?: object;
  id?: string;
  categoryId?: string;
  slug?: string;
};

function getModel(modelName: string): LanguageModelV1 {
  if (modelName.includes("claude")) {
    return anthropic(modelName);
  }
  if (modelName.includes("gpt")) {
    return openai(modelName);
  }
  if (modelName.includes("gemini")) {
    return google('models/' + modelName, {
      topK: 0,
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' }
      ]
    });
  }
  return anthropic('claude-3-5-sonnet-20240620'); // Default model
}

export async function writeArticle(
  topic: string,
  userId: string = 'test-user',
  options: {
    numberOfSearchQueryVariations?: number,
    numberOfWebResultsToInclude?: number,
    audience?: string,
    purpose?: string,
    maxCharactersOfSearchContentToUse?: number,
    tone?: string,
    format?: 'article' | 'bullet-points' | 'Q&A',
    wordLimit?: number,
    includeSummary?: boolean,
    languageLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    citationStyle?: 'footnote' | 'hyperlinked-text' | 'endnotes',
    modelName?: 'claude-3-5-sonnet-20240620' | 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' |
        'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-4o-2024-08-06' | 'gpt-4o-mini' | 'gpt-4o-mini-2024-07-18' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-turbo-preview' | 'gpt-4-0125-preview' | 'gpt-4-1106-preview' | 'gpt-4' | 'gpt-4-0613' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' |
        'gemini-1.5-flash-latest' | 'gemini-1.5-flash' | 'gemini-1.5-pro-latest' | 'gemini-1.5-pro' | 'gemini-1.0-pro'
        // doesn't work 'gemini-pro' ,
  } = {}
): Promise<Article> {
  const {
    numberOfSearchQueryVariations = 1,
    numberOfWebResultsToInclude = 10,
    audience = 'general',
    purpose = 'inform',
    maxCharactersOfSearchContentToUse = 999999,
    tone = 'neutral',
    format = 'article',
    wordLimit,
    includeSummary = false,
    languageLevel = 'intermediate',
    citationStyle = 'hyperlinked-text',
    modelName = 'claude-3-5-sonnet-20240620',
  } = options;

  console.log(`Starting research on topic: "${topic}"`);

  const searchQueries = await generateSearchQueries(topic, numberOfSearchQueryVariations);
  console.log("Generated search queries:", searchQueries);

  const searchResults = await getSearchResults(searchQueries, numberOfWebResultsToInclude);
  console.log(`Found ${searchResults.length} search results.`);

  console.log("Synthesizing report...");

  const model: LanguageModelV1 = getModel(modelName);

  let inputData = searchResults.map(
    (item) => `--START ITEM: ${item.title}--\n
    TITLE: ${item.title}\n
    URL: ${item.url}\n
    CONTENT: ${item.text.slice(0, maxCharactersOfSearchContentToUse)}\n
    --END ITEM: ${item.title}--\n`
  ).join("");

  // strip numerical footnote brackets from the text like [1] or [12], etc
    inputData = inputData.replace(/\[\d+\]/g, '');

  let citationInstructions = '';
  if (citationStyle === 'footnote') {
    citationInstructions = 'Provide citations in the text using markdown footnote notation like [^1].';
  } else if (citationStyle === 'hyperlinked-text') {
    citationInstructions = 'Hyperlink the relevant text in the report to the source URLs used using markdown hyperlink notation like [text](https://link-where-you-got-the-information).';
  }

  const prompt = `
    Write an extremely information-dense and comprehensive ${format} on the topic of "${topic}" based on the Web Search Results below.
    
    # Guidelines
    
    Avoid fluff and filler content. Focus on providing the most relevant and useful information.
    DO NOT include the title in the content.
    Be as quantitative and data-driven as possible!  
    Use tables as much as appropriate.
    If the topic is a question with a quantitative answer, please answer in the first sentence.
    Separate sections with headings.
    
    Audience: ${audience}
    Purpose: ${purpose}
    Tone: ${tone}
    Language Level: ${languageLevel}
    Citation Style: ${citationInstructions}
    ${wordLimit ? `Word Limit: ${wordLimit} words` : ''}
    ${includeSummary ? 'Include a brief summary at the beginning.' : ''}

# Web Search Results
    Here is a list of web pages and excerpts from them that you can use to write the report:
    ${inputData}
  `;

  const result = await generateObject({
    model: model,
    schema: GeneratedReportSchema,
    prompt,
  });

  debugger;
  console.log("Article generated successfully!", result.object);

  const report = result.object as unknown as ReportOutput;
  report.searchResults = searchResults;
  report.generationOptions = options;

  // find or create category
  let category = await prisma.articleCategory.findFirst({
    where: {
      name: report.categoryName
    }
  });

    if (!category) {
        // Create the category if it doesn't exist
        category = await prisma.articleCategory.create({
            data: {
                name: report.categoryName,
                slug: slugify(report.categoryName)
            }
        });
    }

  // Save the article to the database
  const savedArticle = await prisma.article.create({
    data: {
      title: report.title,
      slug: slugify(report.title),
      description: report.description,
      content: report.content,
      status: 'DRAFT',
      visibility: 'PUBLIC',
      promptedTopic: topic,
      featuredImage: report.featuredImage,
      userId: userId,
      categoryId: category.id,
      tags: {
        connectOrCreate: report.tags.map(tag => ({
          where: { name: tag },
          create: { name: tag, slug: slugify(tag) }
        }))
      },
      sources: {
        create: report.sources.map(source => ({
          url: source.url,
          title: source.title,
          description: source.description
        }))
      },
      searchResults: {
        create: report.searchResults.map(result => ({
          score: result.score || 0,
          title: result.title || '',
          url: result.url,
          publishedDate: result.publishedDate || null,
          author: result.author || null,
          text: result.text
        }))
      },
      generationOptions: {
        create: {
          numberOfSearchQueryVariations: options.numberOfSearchQueryVariations || 1,
          numberOfWebResultsToInclude: options.numberOfWebResultsToInclude || 10,
          audience: options.audience || 'general',
          purpose: options.purpose || 'inform',
          maxCharactersOfSearchContentToUse: options.maxCharactersOfSearchContentToUse || 999999,
          tone: options.tone || 'neutral',
          format: options.format || 'article'
        }
      }
    },
    include: {
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true
    }
  });

  console.log("Article saved successfully!", savedArticle.id);

  return savedArticle;
}

export async function findOrCreateArticleByPromptedTopic(promptedTopic: string, userId: string = 'test-user'): Promise<Article> {
  let article: Article | null = null;
  if(userId){
    article = await prisma.article.findFirst({
      where: {
        promptedTopic: promptedTopic,
        userId: userId
      }
    });
  } else {
    article = await prisma.article.findFirst({
      where: {
      promptedTopic: promptedTopic
    }
  });
  }
  if(article){
    return article;
  }
  const generatedReport = await writeArticle(promptedTopic, userId);
  article = await prisma.article.findUnique({
    where: {
      id: generatedReport.id
    },
    include: {
      tags: true,
      sources: true,
      searchResults: true,
      generationOptions: true
    }
  });
  
  if (!article) {
    throw new Error(`Article not found after creation: ${generatedReport.id}`);
  }
  
  return article;
}

export async function deleteArticleByPromptedTopic(promptedTopic: string, userId: string = 'test-user'): Promise<void> {
  // Find the article(s) to delete
  const articlesToDelete = await prisma.article.findMany({
    where: {
      promptedTopic: promptedTopic,
      userId: userId
    },
    select: { id: true }
  });

  // Delete related records and the article itself in a transaction
  await prisma.$transaction(async (tx) => {
    for (const article of articlesToDelete) {
      // Delete related records
      await tx.articleSource.deleteMany({ where: { articleId: article.id } });
      await tx.articleSearchResult.deleteMany({ where: { articleId: article.id } });
      await tx.articleGenerationOptions.deleteMany({ where: { articleId: article.id } });

      // Delete the article
      await tx.article.delete({ where: { id: article.id } });
    }
  });
}
