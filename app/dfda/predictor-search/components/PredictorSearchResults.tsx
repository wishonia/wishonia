"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Session } from "next-auth"

import { LoginPromptButton } from "../../../../components/LoginPromptButton"
import type { Study } from "../../../../types/models/Study"
import { joinStudy, searchPredictors } from "../../../dfda/dfdaActions"

// Add this helper function to safely render HTML
function createMarkup(html: string) {
  return { __html: html }
}

export function PredictorSearchResults({
  session,
  userId,
}: {
  session: Session | null
  userId: string | undefined
}) {
  console.log("Session data:", session)
  const searchParams = useSearchParams()
  const effectVariableName = searchParams.get("effectVariableName")
  const [results, setResults] = useState<Study[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [offset, setOffset] = useState(0)
  const LIMIT = 10

  useEffect(() => {
    async function fetchResults() {
      if (!effectVariableName) {
        setResults([])
        return
      }

      setLoading(true)
      setError("")

      try {
        const predictors = await searchPredictors({
          effectVariableName,
          limit: LIMIT,
          offset,
          correlationCoefficient:
            searchParams.get("valence") === "positive"
              ? "(gt)0"
              : searchParams.get("valence") === "negative"
                ? "(lt)0"
                : undefined,
        })

        setResults((prev) =>
          offset > 0 ? [...prev, ...predictors] : predictors
        )
      } catch (err) {
        console.error("Error fetching predictors:", err)
        setError("Failed to load results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [effectVariableName, offset, searchParams])

  const loadMore = () => {
    setOffset((prev) => prev + LIMIT)
  }

  const handleJoinStudy = async (studyId: string) => {
    if (!userId) {
      console.error("No user ID available")
      return
    }

    try {
      const redirectUrl = await joinStudy(studyId, userId)
      window.location.href = redirectUrl
    } catch (error) {
      console.error("Failed to join study:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!effectVariableName) {
    return (
      <div className="text-center text-white/60">
        Enter a search term to find predictors
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-white/60">
        No predictors found for "{effectVariableName}"
      </div>
    )
  }

  return (
    <div className="p-4">
      {results.length > 0 && (
        <div className="mb-6">
          {/* Orange Header Container */}
          <div className="relative rounded-t-2xl bg-[#F48120] p-4">
            <i className="absolute left-4 top-4 text-3xl text-white">📊</i>
            <p className="h-10 whitespace-nowrap text-center text-xl leading-10 text-white">
              Analyzing what affects {effectVariableName}
            </p>
          </div>

          {/* Orange Description Container */}
          <div className="rounded-b-2xl bg-[#F48120] p-4 text-center text-white">
            <p>
              Track more variables to improve predictions and discover new
              correlations.
            </p>
            <div className="mb-2 mt-5">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-[#F48120]"
                onClick={() => {
                  /* Add improve predictions handler */
                }}
              >
                <span className="text-xl">ℹ️</span>
                Improve Predictions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        {results.map((study) => (
          <div
            key={study.id}
            className="list card correlationResultList rounded-lg bg-white shadow-sm"
            style={{ textAlign: "center" }}
          >
            <div className="item-body p-6">
              {study.studyHtml?.studyHeaderHtml && (
                <div
                  onClick={() => {
                    /* Add study page navigation */
                  }}
                  dangerouslySetInnerHTML={createMarkup(
                    study.studyHtml.studyHeaderHtml
                  )}
                  className="cursor-pointer"
                />
              )}

              {!study.studyHtml?.studyHeaderHtml && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">
                    {study.causeVariable?.name} → {study.effectVariable?.name}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Correlation:{" "}
                    {study.statistics?.correlationCoefficient?.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Vote Buttons */}
              <div className="mt-4 flex justify-center gap-4">
                <button
                  className={`px-4 py-2 text-gray-600 transition-colors hover:text-gray-800 ${
                    study.statistics?.userVote === 1 ? "text-green-600" : ""
                  }`}
                  title="Vote Up"
                >
                  👍
                </button>
                <button
                  className={`px-4 py-2 text-gray-600 transition-colors hover:text-gray-800 ${
                    study.statistics?.userVote === 0 ? "text-red-600" : ""
                  }`}
                  title="Vote Down"
                >
                  👎
                </button>
              </div>

              {/* Join Study Button */}
              <div id={`join-study-container-${study.id}`} className="mt-4">
                {study.id &&
                  (userId ? (
                    <button
                      className="rounded-full bg-[#F48120] px-6 py-2 text-white transition-colors hover:bg-[#E37110]"
                      onClick={() => {
                        if (study.id) {
                          handleJoinStudy(study.id)
                        }
                      }}
                    >
                      Join Study
                    </button>
                  ) : (
                    <LoginPromptButton
                      buttonText="Login to Join Study"
                      buttonVariant="default"
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {results.length > 0 && results.length % LIMIT === 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-full bg-[#F48120] px-6 py-2 text-white transition-colors hover:bg-[#E37110]"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
