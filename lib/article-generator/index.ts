import { SearchResults, SearchResultImage } from '@/lib/types/index'
import { generateObject } from "ai"
import { z } from "zod"
import { LanguageModelV1 } from "@ai-sdk/provider"
import { getModel } from "@/lib/utils/modelUtils"

export interface ArticleOptions {
  topic: string
  style: 'formal' | 'casual' | 'technical'
  wordCount: number
  searchResults: SearchResults
}

export interface ArticleSource {
  text: string
  url: string
  title: string
}

export interface ArticleImage {
  url: string
  caption: string
  placement: string
  searchQuery?: string // The query used to find this image
}

export interface GeneratedArticle {
  title: string
  content: string
  style: 'formal' | 'casual' | 'technical'
  sources: ArticleSource[]
  images: ArticleImage[]
  imagePlaceholders: Array<{
    searchQuery: string
    placement: string
    context: string
  }>
}

const log = {
  info: (msg: string, data?: any) => 
    console.log('\x1b[36m%s\x1b[0m', `📝 [Article] ${msg}`, data ? data : ''),
  error: (msg: string, error?: any) => 
    console.error('\x1b[31m%s\x1b[0m', `❌ [Article] ${msg}`, error ? error : ''),
  success: (msg: string, data?: any) => 
    console.log('\x1b[32m%s\x1b[0m', `✅ [Article] ${msg}`, data ? data : '')
}

// Add schema for article generation
const GeneratedArticleContentSchema = z.object({
  content: z.string().describe("The main article content with hyperlinked sources and image placeholders"),
})

export class ArticleGenerator {
  private model: LanguageModelV1

  constructor() {
    this.model = getModel() // Use default model or allow passing model name
  }

  private processImages(images: Array<string | SearchResultImage>): ArticleImage[] {
    return images.map((image, index) => ({
      url: typeof image === 'string' ? image : image.url,
      caption: typeof image === 'string' ? '' : image.description || '',
      placement: `paragraph-${index}`
    }))
  }

  private processSources(searchResults: SearchResults): ArticleSource[] {
    return searchResults.results.map(source => ({
      text: source.content,
      url: source.url,
      title: source.title
    }))
  }

  private async generateArticleContent(
    topic: string,
    style: 'formal' | 'casual' | 'technical',
    wordCount: number,
    sources: ArticleSource[]
  ) {
    const sourceContext = sources.map((source, index) => 
      `Source ${index + 1}: ${source.title}
URL: ${source.url}
Content: ${source.text}
---`
    ).join('\n')

    const prompt = `Write a ${style} article about "${topic}" using the following sources. 

IMPORTANT REQUIREMENTS:
1. Length: Around ${wordCount} words
2. Hyperlinks: EVERY time you use information from a source, you MUST hyperlink the relevant text using markdown links.
   Example: According to [recent research](source-url), quantum computers...
3. Image Placeholders: Insert where relevant using format:
   {image: "search query" | placement: "paragraph-X" | context: "brief description"}

Sources:
${sourceContext}

LINKING RULES:
- Every fact, statistic, or quote MUST be hyperlinked to its source
- Use natural language for link text (not "click here" or "source")
- Multiple links to the same source are encouraged when appropriate
- Link the most relevant words or phrases, not entire sentences
- Every source should be linked at least once

Example of proper linking:
BAD: [According to recent research, quantum computers have achieved new milestones](url)
GOOD: [Recent experiments](url) have shown quantum computers achieving new [computational milestones](url2)

Remember to:
- Maintain a ${style} tone throughout
- Synthesize information from multiple sources
- Be factually accurate and well-organized
- Place image placeholders at natural points in the text`

    const result = await generateObject({
      model: this.model,
      schema: GeneratedArticleContentSchema,
      prompt,
      experimental_telemetry: { isEnabled: true },
    })

    return result.object.content
  }

  private validateSourceLinks(content: string, sources: ArticleSource[]): boolean {
    // Check if each source URL appears at least once in markdown links
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links = Array.from(content.matchAll(markdownLinkRegex))
    const linkedUrls = links.map(match => match[2])

    const missingSourceUrls = sources.filter(source => 
      !linkedUrls.includes(source.url)
    )

    if (missingSourceUrls.length > 0) {
      log.error('Missing source links for:', missingSourceUrls.map(s => s.title))
      return false
    }

    return true
  }

  private extractImagePlaceholders(content: string): {
    content: string,
    placeholders: Array<{
      searchQuery: string
      placement: string
      context: string
    }>
  } {
    const placeholders: Array<{
      searchQuery: string
      placement: string
      context: string
    }> = []
    
    // Extract image placeholders using regex
    const regex = /{image:\s*"([^"]+)"\s*\|\s*placement:\s*"([^"]+)"\s*\|\s*context:\s*"([^"]+)"}/g
    const cleanContent = content.replace(regex, (match, query, placement, context) => {
      placeholders.push({
        searchQuery: query,
        placement,
        context
      })
      return `[IMAGE_PLACEHOLDER:${placement}]`
    })

    return {
      content: cleanContent,
      placeholders
    }
  }

  async generateArticle(options: ArticleOptions): Promise<GeneratedArticle> {
    const { topic, style, wordCount, searchResults } = options
    log.info(`Generating article for topic: "${topic}"`)

    try {
      const relevantSources = this.processSources(searchResults)
      const availableImages = this.processImages(searchResults.images?.slice(0, 3) || [])

      // Generate article content with hyperlinks and image placeholders
      let rawContent = await this.generateArticleContent(
        topic,
        style,
        wordCount,
        relevantSources
      )

      // Validate source links and regenerate if necessary
      let attempts = 0
      while (!this.validateSourceLinks(rawContent, relevantSources) && attempts < 3) {
        log.info('Regenerating article due to missing source links')
        rawContent = await this.generateArticleContent(
          topic,
          style,
          wordCount,
          relevantSources
        )
        attempts++
      }

      // Extract image placeholders and clean content
      const { content, placeholders } = this.extractImagePlaceholders(rawContent)

      // Match available images with placeholders where possible
      const usedImages: ArticleImage[] = []
      placeholders.forEach(placeholder => {
        const matchingImage = availableImages.find(img => 
          !usedImages.includes(img) && 
          (img.caption.toLowerCase().includes(placeholder.searchQuery.toLowerCase()) ||
           img.caption.toLowerCase().includes(placeholder.context.toLowerCase()))
        )
        
        if (matchingImage) {
          usedImages.push({
            ...matchingImage,
            placement: placeholder.placement,
            searchQuery: placeholder.searchQuery
          })
        }
      })

      const article: GeneratedArticle = {
        title: topic,
        style,
        content,
        sources: relevantSources,
        images: usedImages,
        imagePlaceholders: placeholders.filter(p => 
          !usedImages.find(img => img.placement === p.placement)
        )
      }

      log.success('Article generation completed')
      return article

    } catch (error) {
      log.error('Article generation failed', error)
      throw error
    }
  }
}

export const createArticleGenerator = () => new ArticleGenerator()