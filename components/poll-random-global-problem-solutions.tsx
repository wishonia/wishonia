"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const fetchGlobalProblemSolutions = async () => {
    setLoading(true)
    const response = await fetch(
      "/api/globalProblems/" + globalProblemId + "/solutions/random"
    )
    const data = await response.json()
    if (!data.thisGlobalProblemSolution) {
      router.push("/globalProblemSolutions/results")
      return
    }
    if (!data.thatGlobalProblemSolution) {
      router.push("/globalProblemSolutions/results")
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
