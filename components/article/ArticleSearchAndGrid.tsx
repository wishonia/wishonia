import { useState, useEffect } from 'react'
import ArticleGrid from '@/components/ArticleGrid'
import ArticleSearchBox from '@/components/ArticleSearchBox'
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'
import { searchArticles } from '@/app/researcher/researcherActions'


type ArticleSearchAndGridProps = {
  categorySlug?: string
}

export default function ArticleSearchAndGrid({ categorySlug = '' }: ArticleSearchAndGridProps) {
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
        setIsLoading(true)
        try {
            const results = await searchArticles(searchQuery, categorySlug)
            setArticles(results as ArticleWithRelations[])
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setIsLoading(false)
        }
    }
    fetchArticles()
}, [categorySlug, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <>
      <ArticleSearchBox
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        isLoading={isLoading}
      />
      <ArticleGrid articles={articles} />
      {articles.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground mt-6">No articles found.</p>
      )}
    </>
  )
}