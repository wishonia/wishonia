'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import ResearchForm from './ResearchForm'
import ArticleSearchAndGrid from '@/components/article/ArticleSearchAndGrid'

export function ResearchPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialTopic = searchParams?.get('q') || ''

    const handleTopicChange = (topic: string) => {
        router.push(`?q=${encodeURIComponent(topic)}`, { scroll: false })
    }
    
    return (
        <main className="container mx-auto p-4">
            <ResearchForm 
                initialTopic={initialTopic}
                onTopicChange={handleTopicChange}
            />
            <ArticleSearchAndGrid />
        </main>
    )
} 