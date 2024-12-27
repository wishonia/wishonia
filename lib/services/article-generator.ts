import { generateObject } from 'ai'
import { z } from 'zod'

import { getModel } from '@/lib/utils/modelUtils'

import { MarkdownEnhancer } from '../content/markdownEnhancer'
import { ArticleMetadataSchema } from '../schemas/article'

import { FileService } from './file-service'

export class ArticleGenerator {
  private fileService: FileService
  private markdownEnhancer: MarkdownEnhancer

  constructor(
    tavilyApiKey: string,
    outputDir: string
  ) {
    this.fileService = new FileService(outputDir)
    this.markdownEnhancer = new MarkdownEnhancer(tavilyApiKey)
  }

  private logStep(emoji: string, message: string, details?: string) {
    console.log(`\n${emoji} ${message}${details ? `\n   ${details}` : ''}`)
  }

  private logSuccess(message: string, details?: string) {
    console.log(`   ✓ ${message}${details ? ` (${details})` : ''}`)
  }

  private logError(message: string, error: any) {
    console.error(`   ❌ ${message}:`, error)
  }

  private async generateArticleContent(topic: string) {
    const ArticleContentSchema = z.object({
      content: z.string().describe('The article content without links or images - these will be added later'),
      metadata: z.object({
        tags: z.array(z.string()),
        categories: z.array(z.string()),
        seo_title: z.string(),
        seo_description: z.string(),
        seo_keywords: z.array(z.string())
      })
    })

    const result = await generateObject({
      model: getModel(),
      schema: ArticleContentSchema,
      prompt: `Write a comprehensive article about "${topic}".

REQUIREMENTS:
- Be factually accurate and well-organized
- Write in a clear, engaging style
- Focus on providing valuable information
- Include natural places where images would be helpful using:
  {image: "description of needed image" | placement: "inline" | context: "why this image is needed here"}

Note: Links and images will be added automatically later - focus on writing good content.`
    })

    return result.object
  }

  async generateArticle(topic: string): Promise<void> {
    this.logStep('📝', 'Generating article', `Topic: "${topic}"`)
    
    try {
      // Step 1: Generate initial content
      this.logStep('✍️', 'Generating initial article content')
      const initialArticle = await this.generateArticleContent(topic)
      
      // Step 2: Enhance content with links and images
      this.logStep('🔗', 'Enhancing content with sources and images')
      const enhancementResult = await this.markdownEnhancer.enhance(
        initialArticle.content,
        topic
      )
      
      this.logSuccess('Content enhanced', 
        `Added ${enhancementResult.termsLinked} sources and ${enhancementResult.imagesAdded} images`
      )

      // Get featured image from the first suggested image
      const featuredImage = enhancementResult.suggestedImages[0] || {
        description: topic,
        url: '' // You might want to handle this case better
      }

      // Generate metadata using the enhanced content
      const metadata = ArticleMetadataSchema.parse({
        ...initialArticle.metadata,
        featured_image: featuredImage.url,
        featured_image_alt: featuredImage.description,
        date: new Date().toISOString(),
        status: 'draft' as const,
        author: 'AI Generator',
        excerpt: initialArticle.metadata.seo_description,
        tags: initialArticle.metadata.tags,
        categories: initialArticle.metadata.categories,
        seo_title: initialArticle.metadata.seo_title,
        seo_description: initialArticle.metadata.seo_description,
        seo_keywords: initialArticle.metadata.seo_keywords
      })

      this.fileService.saveArticle(topic, enhancementResult.content, metadata)
      this.logSuccess('Article saved successfully')
      
      // Final stats
      this.logStep('📊', 'Article Generation Stats', 
        `Sources: ${enhancementResult.termsLinked}\n` +
        `   Images: ${enhancementResult.imagesAdded}\n` +
        `   Content Length: ${enhancementResult.content.length} characters\n` +
        `   Category: ${metadata.categories[0]}\n` +
        `   Tags: ${metadata.tags.join(', ')}`
      )

    } catch (error) {
      this.logError(`Error generating article for "${topic}"`, error)
      throw error
    }
  }

  async generateArticles(topics: string[]): Promise<void> {
    this.logStep('🚀', 'Starting article generation')
    console.log('   Topics to process:', topics.length)

    for (const topic of topics) {
      await this.generateArticle(topic)
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    this.logStep('🎉', 'Article generation complete!', 
      `Successfully processed ${topics.length} topics`
    )
  }
}
