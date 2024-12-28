'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { findOrCreateArticleByTopic } from "@/app/researcher/researcherActions"
import ArticleRenderer from '@/components/ArticleRenderer'
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'

interface ResearchFormProps {
    initialTopic?: string
    onTopicChange: (topic: string) => void
}

export default function ResearchForm({ initialTopic = '', onTopicChange }: ResearchFormProps) {
    const { data: session } = useSession()
    const router = useRouter()

    const [article, setArticle] = useState<ArticleWithRelations | null>(null)
    const [error, setError] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [topic, setTopic] = useState(initialTopic)

    async function handleSubmit(submittedTopic: string) {
        if (!session?.user?.id) {
            router.push('/auth/signin')
            return
        }

        if (!submittedTopic) {
            setError('Please enter a topic')
            return
        }

        setIsGenerating(true)
        setError('')

        try {
            const generatedArticle = await findOrCreateArticleByTopic(submittedTopic, session.user.id)
            setArticle(generatedArticle)
            onTopicChange(submittedTopic)
        } catch (err) {
            setError('Failed to generate article. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Autonomous Research Agent</CardTitle>
                    <CardDescription>
                        Enter a topic for me to research and I'll write an article with sources!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit(topic)
                    }} className="flex gap-4">
                        <Input 
                            type="text" 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter article topic" 
                            className="flex-grow" 
                        />
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating ? 'Researching...' : 'Start Researching'}
                        </Button>
                    </form>
                </CardContent>
                {error && (
                    <CardFooter>
                        <p className="text-red-500">{error}</p>
                    </CardFooter>
                )}
            </Card>
            {isGenerating && (
                <div className="w-4/5 max-w-[600px] h-[600px] mx-auto">
                    <GlobalBrainNetwork />
                </div>
            )}
            {!isGenerating && article && <ArticleRenderer article={article} currentUserId={session?.user?.id} />}
        </>
    )
} 