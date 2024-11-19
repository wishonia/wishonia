'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getArticleBySlugAction } from '@/app/researcher/researcherActions'
import ArticleRenderer from '@/components/ArticleRenderer'
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'
import { useSession } from 'next-auth/react'

export default function ArticlePage() {
    const { data: session, status } = useSession() 
    const [article, setArticle] = useState<ArticleWithRelations | null>(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(status === "loading")
    const params = useParams()
    if(!params) {
        return <div>Invalid article slug</div>
    }

    useEffect(() => {
        async function fetchArticle() {
            if (!params || typeof params.articleSlug !== 'string') {
                setError('Invalid article slug')
                setIsLoading(false)
                return
            }

            try {
                const fetchedArticle = await getArticleBySlugAction(params.articleSlug)
                setArticle(fetchedArticle)
            } catch (err) {
                setError('Failed to fetch article. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchArticle()
    }, [params])

    return (
        <main className="container mx-auto p-4">
        {isLoading && <p>Loading article...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && article && <ArticleRenderer article={article} currentUserId={session?.user?.id} />}
        </main>
    )
}