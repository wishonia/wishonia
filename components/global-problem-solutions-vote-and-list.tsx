"use client"

import React, { useEffect, useState } from "react"
import { GlobalProblem } from "@prisma/client"
import { GlobalProblemSolutionsList } from "@/components/global-problem-solutions-list"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { PollRandomGlobalProblemSolutions } from "@/components/poll-random-global-problem-solutions"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  globalProblemId: string
}

export const GlobalProblemSolutionsVoteAndSolutionsList: React.FC<
  PollProps
> = ({ globalProblemId }) => {
  const [globalProblem, setGlobalProblem] = useState<GlobalProblem>()
  const [loading, setLoading] = useState(false)

  const fetchGlobalProblem = async (globalProblemId: string) => {
    setLoading(true)
    const response = await fetch("/api/globalProblems/" + globalProblemId)
    const data = await response.json()
    setGlobalProblem(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchGlobalProblem(globalProblemId)
  }, [globalProblemId])

  if (loading || !globalProblem) {
    return <SpinningLoader />
  }

  return (
    <Shell>
      <DashboardHeader
        heading={`Solutions for ${globalProblem.name}`}
        text={`Vote on the best solutions to ${globalProblem.name}!`}
      ></DashboardHeader>
      <PollRandomGlobalProblemSolutions
        globalProblemId={globalProblemId}
      ></PollRandomGlobalProblemSolutions>
      <GlobalProblemSolutionsList
        globalProblemId={globalProblemId}
      ></GlobalProblemSolutionsList>
    </Shell>
  )
}
