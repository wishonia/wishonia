import { z } from 'zod'

export const articleSchema = z.object({
  topic: z.string().describe('The main topic to write about'),
  style: z.enum(['formal', 'casual', 'technical']).describe('The writing style to use'),
  word_count: z.number().min(100).max(2000).describe('Target word count for the article'),
  search_results: z.any().describe('Search results to use as sources')
}) 