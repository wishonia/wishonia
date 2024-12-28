'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

import { getArticleBySlugAction } from '@/app/researcher/researcherActions'
import ArticleRenderer from '@/components/ArticleRenderer'
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'

interface ArticleContentProps {
    articleSlug: string
}

export function ArticleContent({ articleSlug }: ArticleContentProps) {
    const { data: session, status } = useSession() 
    const [article, setArticle] = useState<ArticleWithRelations | null>(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isSubscribed = true;
        async function fetchArticle() {
            try {
                const fetchedArticle = await getArticleBySlugAction(articleSlug)
                if (isSubscribed) {
                    setArticle(fetchedArticle)
                }
            } catch (err) {
                if (isSubscribed) {
                    setError('Failed to fetch article. Please try again.')
                }
            } finally {
                if (isSubscribed) {
                    setIsLoading(false)
                }
            }
        }

        fetchArticle()
        return () => {
            isSubscribed = false
        }
    }, [articleSlug])

    return (
        <main className="container mx-auto p-4">
            {isLoading && <p>Loading article...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && article && <ArticleRenderer article={article} currentUserId={session?.user?.id} />}
        </main>
    )
} 