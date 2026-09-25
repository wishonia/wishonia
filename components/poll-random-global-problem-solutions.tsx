"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

import { PollSpecificGlobalProblemSolutions } from "@/components/poll-specific-global-problem-solutions"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  globalProblemId: string
}

export const PollRandomGlobalProblemSolutions: React.FC<PollProps> = ({
  globalProblemId,
}) => {
  const [globalProblemSolutions, setGlobalProblemSolutions] = useState<{
    thisGlobalProblemSolution?: any
    thatGlobalProblemSolution?: any
  }>({})
  const [loading, setLoading] = useState(false)
  const [noPairsLeft, setNoPairsLeft] = useState(false)
  const fetchGlobalProblemSolutions = async () => {
    setLoading(true)
    const response = await fetch(
      "/api/globalProblems/" + globalProblemId + "/solutions/random"
    )
    const data = await response.json()
    // The landing page and the problem dashboard embed this poll, so show a
    // link instead of navigating away when no pair is left.
    if (!data.thisGlobalProblemSolution || !data.thatGlobalProblemSolution) {
      setNoPairsLeft(true)
      setLoading(false)
      return
    }
    setGlobalProblemSolutions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchGlobalProblemSolutions()
    }
  }, [])

  if (noPairsLeft) {
    return (
      <p className="text-center text-muted-foreground">
        There are no solution pairs left to compare.{" "}
        <Link
          href={`/globalProblems/${globalProblemId}/solutions`}
          className="underline"
        >
          See the ranked solutions
        </Link>
      </p>
    )
  }

  if (
    loading ||
    !globalProblemSolutions.thisGlobalProblemSolution ||
    !globalProblemSolutions.thatGlobalProblemSolution
  ) {
    return <SpinningLoader />
  }

  return (
    <PollSpecificGlobalProblemSolutions
      thisGlobalProblemSolution={
        globalProblemSolutions.thisGlobalProblemSolution
      }
      thatGlobalProblemSolution={
        globalProblemSolutions.thatGlobalProblemSolution
      }
      updatePair={fetchGlobalProblemSolutions}
    />
  )
}
