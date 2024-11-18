import { z } from 'zod';

export const ArticleMetadataSchema = z.object({
  title: z.string().describe("The title of the article"),
  description: z.string().describe("A brief description or summary"),
  featured_image: z.string().optional().describe("URL of the featured image"),
  featured_image_alt: z.string().optional().describe("Alt text for the featured image"),
  tags: z.array(z.string()).describe("Article tags"),
  categories: z.array(z.string()).describe("Article categories"),
  status: z.enum(['draft', 'publish']).describe("Publication status"),
  date: z.string().describe("Publication date in ISO format"),
  author: z.string().describe("Article author"),
  excerpt: z.string().describe("Short excerpt for previews"),
  seo_title: z.string().describe("SEO optimized title"),
  seo_description: z.string().describe("SEO meta description"),
  seo_keywords: z.array(z.string()).describe("SEO keywords")
});

export type ArticleMetadata = z.infer<typeof ArticleMetadataSchema>;

export const ArticleSchema = z.object({
  title: z.string().describe("The title of the article"),
  description: z.string().describe("A brief description or summary of the article"),
  content: z.string().describe("The main content of the article in markdown format"),
  metadata: z.object({
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    seo_title: z.string(),
    seo_description: z.string(),
    seo_keywords: z.array(z.string())
  })
});

export type Article = z.infer<typeof ArticleSchema>; 