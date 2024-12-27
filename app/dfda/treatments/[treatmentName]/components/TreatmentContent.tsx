'use client'

import { AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"

import { findOrCreateArticleByTopic } from "@/app/researcher/researcherActions"
import ArticleRenderer from "@/components/ArticleRenderer"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { ArticleWithRelations } from "@/lib/agents/researcher/researcher"

import TreatmentAnalyzer from "../../../components/treatment-analyzer"

interface TreatmentContentProps {
  treatmentName: string
}

export function TreatmentContent({ treatmentName }: TreatmentContentProps) {
  const { data: session } = useSession()
  const [article, setArticle] = useState<ArticleWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetaAnalysis() {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const metaAnalysis = await findOrCreateArticleByTopic(
          `Safety and Efficacy of ${treatmentName}`,
          session.user.id
        )
        if (metaAnalysis) {
          setArticle(metaAnalysis)
        } else {
          setError("Unable to generate analysis for this treatment")
        }
      } catch (error) {
        console.error("Error fetching meta-analysis:", error)
        setError("Error fetching treatment analysis")
      } finally {
        setLoading(false)
      }
    }

    fetchMetaAnalysis()
  }, [session?.user?.id, treatmentName])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Sign in to view treatment analysis</h2>
        <LoginPromptButton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {article && <ArticleRenderer article={article} />}
      <TreatmentAnalyzer treatmentName={treatmentName} />
    </div>
  )
} 