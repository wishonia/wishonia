"use server"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { getRandomGlobalSolutionPair } from "@/lib/globalSolutions"

export async function getRandomGlobalSolutionPairAction() {
  const userId = await getUserIdServer()
  const randomPair = await getRandomGlobalSolutionPair(userId)
  
  if (!randomPair[0] || !randomPair[1]) {
    return null
  }

  return {
    thisGlobalSolution: randomPair[0],
    thatGlobalSolution: randomPair[1],
  }
} 