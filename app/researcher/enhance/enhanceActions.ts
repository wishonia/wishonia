'use server'

import { MarkdownEnhancer, MarkdownEnhancementResult } from '@/lib/content/markdownEnhancer'

interface EnhanceResponse {
  enhancedContent: string;
}

export async function enhanceContent(content: string): Promise<EnhanceResponse> {
  const enhancer = new MarkdownEnhancer(process.env.TAVILY_API_KEY || '')

  
  try {
    const result = await enhancer.enhance(content)
    // Map the result.content to enhancedContent for the frontend
    return {
      enhancedContent: result.content
    }
  } catch (error) {
    console.error('Enhancement error:', error)
    throw new Error('Failed to enhance content')
  }
} 