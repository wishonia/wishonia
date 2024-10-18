"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ArticleRenderer from '@/components/ArticleRenderer'
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'
import GlobalHealthOptimizationAgent from "@/components/landingPage/global-health-optimization-agent"
import { findOrCreateArticleByTopic } from "@/app/researcher/researcherActions"
import { UserAuthForm } from "@/components/user/user-auth-form"

export default function TreatmentPage() {
    const { data: session, status } = useSession()
    const params = useParams()
    const [article, setArticle] = useState<ArticleWithRelations | null>(null)
    const [loading, setLoading] = useState(true)
    if(!params){
        console.error('No URL params in TreatmentPage')
        return <div>No URL params!</div>
    }
    const treatmentName = typeof params.treatmentName === 'string' ? decodeURIComponent(params.treatmentName) : ''

    useEffect(() => {
        async function fetchMetaAnalysis() {
            if (!session?.user?.id || !treatmentName) {
                setLoading(false)
                return
            }

            try {
                const metaAnalysis = await findOrCreateArticleByTopic(
                    `Article on the Safety and Efficacy of ${treatmentName} for Various Conditions`,
                    session.user.id
                )
                setArticle(metaAnalysis)
            } catch (error) {
                console.error('Error fetching meta-analysis:', error)
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchMetaAnalysis()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [treatmentName, session?.user?.id, status])

    if (status === 'loading' || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlobalHealthOptimizationAgent />
            </div>
        )
    }

    if (!session?.user?.id) {
        return <UserAuthForm />
    }

    if (!article) {
        return <div className="container mx-auto px-4 py-8">Failed to load meta-analysis.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Treatment: {treatmentName}</h1>
            <ArticleRenderer article={article} currentUserId={session.user.id} />
        </div>
    )
}