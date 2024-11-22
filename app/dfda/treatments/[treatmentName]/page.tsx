"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { useSession } from "next-auth/react"

import { ArticleWithRelations } from "@/lib/agents/researcher/researcher"
import { Button } from "@/components/ui/button"
import ArticleRenderer from "@/components/ArticleRenderer"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { findOrCreateArticleByTopic } from "@/app/researcher/researcherActions"

import TreatmentAnalyzer from "../../components/treatment-analyzer"

export default function TreatmentPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<ArticleWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!params) {
    console.error("No URL params in TreatmentPage")
    return <div>No URL params!</div>
  }
  const treatmentName =
    typeof params.treatmentName === "string"
      ? decodeURIComponent(params.treatmentName)
      : ""

  useEffect(() => {
    async function fetchMetaAnalysis() {
      if (!session?.user?.id || !treatmentName) {
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
        setError("An error occurred while analyzing this treatment")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchMetaAnalysis()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [treatmentName, session?.user?.id, status])

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TreatmentAnalyzer treatmentName={treatmentName} />
      </div>
    )
  }

  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-4 text-xl font-semibold">
          Sign in to view treatment analysis
        </h2>
        <LoginPromptButton
          buttonText="Sign in to continue"
          buttonVariant="neobrutalist"
          buttonSize="lg"
        />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Analysis Unavailable
          </h2>
          <p className="mb-6 text-red-600">
            {error || "Failed to load treatment analysis"}
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} variant="default">
              Try Again
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement error reporting
                alert("Error reported. We will look into this issue.")
              }}
              variant="secondary"
            >
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Treatment: {treatmentName}</h1>
      <ArticleRenderer article={article} currentUserId={session.user.id} />
    </div>
  )
}