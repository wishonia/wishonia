"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getMetaAnalysis } from '@/app/dfda/dfdaActions'
import ArticleRenderer from '@/components/ArticleRenderer'
import { ArticleWithRelations } from '@/lib/agents/researcher/researcher'
import GlobalHealthOptimizationAgent from "@/components/landingPage/global-health-optimization-agent";
import { useSession } from 'next-auth/react'

export default function TreatmentForConditionPage() {
    const { data: session, status } = useSession()
    const params = useParams()
    const [article, setArticle] = useState<ArticleWithRelations | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!params) return;

        async function fetchMetaAnalysis() {
            if (!params) {
                console.error('Params is null in fetchMetaAnalysis');
                return;
            }
            console.log("Fetching meta-analysis for", params.treatmentName, params.conditionName)
            if (typeof params.treatmentName === 'string' && typeof params.conditionName === 'string') {
                try {
                    const metaAnalysis = await getMetaAnalysis(params.treatmentName, params.conditionName)
                    setArticle(metaAnalysis)
                } catch (error) {
                    console.error('Error fetching meta-analysis:', error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchMetaAnalysis()
    }, [params])

    if (loading) {
        return <div>Loading...</div>
    }

    if(!params){
        console.error('No URL params in TreatmentForConditionPage')
        return <div>No URL params!</div>
    }

    if (loading) {
        return <div className="container mx-auto px-4 py-8">
            <GlobalHealthOptimizationAgent />
        </div>
    }

    if (!article) {
        return <div className="container mx-auto px-4 py-8">Failed to load meta-analysis.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ArticleRenderer article={article} currentUserId={session?.user?.id} />
        </div>
    )
}