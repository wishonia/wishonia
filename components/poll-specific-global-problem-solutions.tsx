"use client"

import React from "react"
import {
  GlobalProblemSolution,
  GlobalProblemSolutionPairAllocation,
} from "@prisma/client"
import { User } from "next-auth"

import { PollSpecificGeneral } from "@/components/poll-specific-general"

interface PollProps {
  thisGlobalProblemSolution: GlobalProblemSolution
  thatGlobalProblemSolution: GlobalProblemSolution
  updatePair?: () => void
  user?: User
}

export const PollSpecificGlobalProblemSolutions: React.FC<PollProps> = ({
  thisGlobalProblemSolution,
  thatGlobalProblemSolution,
  updatePair,
  user,
}) => {
  const getGlobalProblemSolutionName = (item: { name: string }) => {
    const start = item.name.indexOf("How ") + 4 // +4 to skip "How "
    const end = item.name.indexOf(" Solves", start)
    return start > 3 && end > -1 ? item.name.substring(start, end) : ""
  }

  const getGlobalProblemSolutionImage = (item: {
    featuredImage: string | null
  }) => item.featuredImage || ""

  const createGlobalProblemSolutionAllocation = (
    thisGlobalProblemSolutionId: string,
    thatGlobalProblemSolutionId: string,
    thisGlobalProblemSolutionPercentage: number
  ) => {
    const allocation: Partial<GlobalProblemSolutionPairAllocation> = {
      thisGlobalProblemSolutionId,
      thatGlobalProblemSolutionId,
      thisGlobalProblemSolutionPercentage,
    }
    localStorage.setItem(
      "globalProblemSolutionPairAllocation",
      JSON.stringify(allocation)
    )
  }

  return (
    <PollSpecificGeneral
      thisItem={thisGlobalProblemSolution}
      thatItem={thatGlobalProblemSolution}
      updatePair={updatePair}
      user={user}
      getItemName={getGlobalProblemSolutionName}
      getItemImage={getGlobalProblemSolutionImage}
      createAllocation={createGlobalProblemSolutionAllocation}
    />
  )
}
