import { User } from "@prisma/client"

import { prisma } from "@/lib/db"
import {
  aggregateGlobalSolutionPairAllocations,
  getAllRandomGlobalSolutionPairs,
} from "@/lib/globalSolutions"

export async function seedGlobalSolutionPairAllocations(testUser: User) {
  const pairs = await getAllRandomGlobalSolutionPairs()
  let idsWithPair: string[] = []
  for (const pair of pairs) {
    if (idsWithPair.includes(pair[0].id) && idsWithPair.includes(pair[1].id)) {
      continue
    }
    if (!pair[1]) {
      console.log("Pair is missing a second element", pair)
      continue
    }
    const result = await prisma.globalSolutionPairAllocation.create({
      data: {
        thisGlobalSolutionId: pair[0].id,
        thatGlobalSolutionId: pair[1].id,
        userId: testUser.id,
        thisGlobalSolutionPercentage: 50,
      },
    })
    idsWithPair.push(pair[0].id)
    idsWithPair.push(pair[1].id)
  }
  await aggregateGlobalSolutionPairAllocations()
}
