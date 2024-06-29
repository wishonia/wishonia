import { User } from "@prisma/client"

import { prisma } from "@/lib/db"
import {
  aggregateGlobalProblemPairAllocations,
  getAllRandomGlobalProblemPairs,
} from "@/lib/globalProblems"

export async function seedGlobalProblemPairAllocations(testUser: User) {
  const pairs = await getAllRandomGlobalProblemPairs()
  let idsWithPair: string[] = []
  for (const pair of pairs) {
    if (idsWithPair.includes(pair[0].id) && idsWithPair.includes(pair[1].id)) {
      continue
    }
    try {
      const existingAllocation =
        await prisma.globalProblemPairAllocation.findFirst({
          where: {
            thisGlobalProblemId: pair[0].id,
            thatGlobalProblemId: pair[1].id,
            userId: testUser.id,
          },
        })
      if (existingAllocation) {
        continue
      }
      const result = await prisma.globalProblemPairAllocation.create({
        data: {
          thisGlobalProblemId: pair[0].id,
          thatGlobalProblemId: pair[1].id,
          userId: testUser.id,
          thisGlobalProblemPercentage: 50,
        },
      })
      idsWithPair.push(pair[0].id)
      idsWithPair.push(pair[1].id)
    } catch (e) {
      debugger
      console.log(`Error allocating ${pair[0].name} and ${pair[1].name}`)
    }
  }
  await aggregateGlobalProblemPairAllocations()
}
