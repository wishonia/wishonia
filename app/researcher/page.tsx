'use client'

import { useState } from 'react'
import { writeArticleAction} from '@/app/actions'
import ArticleRenderer from '@/components/ArticleRenderer'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportOutput } from '@/lib/agents/researcher/researcher'
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network"

export default function Home() {
    const [article, setArticle] = useState<ReportOutput | null>(null)
    const [error, setError] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    async function handleSubmit(formData: FormData) {
        const topic = formData.get('topic') as string
        if (!topic) {
            setError('Please enter a topic')
            return
        }

        setIsGenerating(true)
        setError('')

        try {
            const generatedArticle = await writeArticleAction(topic)
            setArticle(generatedArticle)
        } catch (err) {
            setError('Failed to generate article. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <main className="container mx-auto p-4">
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
                        handleSubmit(new FormData(e.currentTarget))
                    }} className="flex gap-4">
                        <Input type="text" name="topic" placeholder="Enter article topic" className="flex-grow" />
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Article'}
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
            {!isGenerating && article && <ArticleRenderer {...article} />}
        </main>
    )
}