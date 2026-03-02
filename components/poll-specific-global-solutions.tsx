"use client"

import React from "react"
import { GlobalSolution, GlobalSolutionPairAllocation } from "@prisma/client"
import { PollSpecificGeneral } from "@/components/poll-specific-general"

interface PollProps {
  thisGlobalSolution: GlobalSolution
  thatGlobalSolution: GlobalSolution
  updatePair?: () => void
}

export const PollSpecificGlobalSolutions: React.FC<PollProps> = ({
  thisGlobalSolution,
  thatGlobalSolution,
  updatePair,
}) => {
  const getGlobalSolutionName = (item: { name: string }) => "" + item.name

  const getGlobalSolutionImage = (item: { featuredImage: string | null }) =>
    item.featuredImage || ""

  const createGlobalSolutionAllocation = (
    thisGlobalSolutionId: string,
    thatGlobalSolutionId: string,
    thisGlobalSolutionPercentage: number
  ) => {
    const allocation: Partial<GlobalSolutionPairAllocation> = {
      thisGlobalSolutionId,
      thatGlobalSolutionId,
      thisGlobalSolutionPercentage,
    }
    localStorage.setItem(
      "globalSolutionPairAllocation",
      JSON.stringify(allocation)
    )
  }

  return (
    <PollSpecificGeneral
      thisItem={thisGlobalSolution}
      thatItem={thatGlobalSolution}
      updatePair={updatePair}
      getItemName={getGlobalSolutionName}
      getItemImage={getGlobalSolutionImage}
      createAllocation={createGlobalSolutionAllocation}
    />
  )
}
