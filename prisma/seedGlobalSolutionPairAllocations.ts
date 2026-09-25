import { User } from "@prisma/client"

import { prisma } from "@/lib/db"
import {
  aggregateGlobalSolutionPairAllocations,
  getAllRandomGlobalSolutionPairs,
} from "@/lib/globalSolutions"

export async function seedGlobalSolutionPairAllocations(testUser: User) {
  const pairs = await getAllRandomGlobalSolutionPairs()
  // Start from the solutions this user already voted on, so a second seed run
  // adds no votes instead of failing on the unique constraint.
  const existingAllocations =
    await prisma.globalSolutionPairAllocation.findMany({
      where: { userId: testUser.id },
    })
  const idsWithPair = existingAllocations.flatMap((allocation) => [
    allocation.thisGlobalSolutionId,
    allocation.thatGlobalSolutionId,
  ])
  for (const pair of pairs) {
    if (!pair[1]) {
      console.log("Pair is missing a second element", pair)
      continue
    }
    if (idsWithPair.includes(pair[0].id) && idsWithPair.includes(pair[1].id)) {
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
