"use server"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { getRandomGlobalProblemPair } from "@/lib/globalProblems"

export async function getRandomGlobalProblemPairAction() {
  const userId = await getUserIdServer()
  const randomPair = await getRandomGlobalProblemPair(userId)
  
  if (!randomPair[0] || !randomPair[1]) {
    return null
  }

  return {
    thisGlobalProblem: randomPair[0],
    thatGlobalProblem: randomPair[1],
  }
} 