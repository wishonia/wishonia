import { tool } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { articleSchema } from '@/lib/schema/article'
import { ToolProps } from '.'
import { ArticleSection } from '@/app/search/components/article-section'
import { createArticleGenerator } from '@/lib/article-generator'

export const articleWriterTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: 'Write an article with hyperlinked sources and relevant images',
    parameters: articleSchema,
    execute: async ({ topic, style, word_count, search_results }) => {
      const streamResults = createStreamableValue()
      const articleGenerator = createArticleGenerator()

      try {
        const article = await articleGenerator.generateArticle({
          topic,
          style,
          wordCount: word_count,
          searchResults: search_results
        })

        uiStream.update(
          <ArticleSection
            result={article}
            style={style}
          />
        )

        streamResults.done(article)
        return article

      } catch (error) {
        console.error('Article generation failed:', error)
        streamResults.done(null)
        return null
      }
    }
  }) 