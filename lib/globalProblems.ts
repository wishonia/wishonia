import { GlobalProblem } from "@prisma/client"

import { prisma } from "@/lib/db"
import { aggregateByTotalShare } from "@/lib/pairwiseAllocation"
import { createSlug } from "@/lib/stringHelper"

export async function getRandomGlobalProblemPair(userId: string | undefined) {
  let ids: { id: string }[] = []
  if (userId) {
    ids = await prisma.$queryRaw`
          SELECT id
          FROM "GlobalProblem"
          WHERE id NOT IN (
            SELECT "thisGlobalProblemId" FROM "GlobalProblemPairAllocation" WHERE "GlobalProblem"."userId" = ${userId}
            UNION
            SELECT "thatGlobalProblemId" FROM "GlobalProblemPairAllocation" WHERE "GlobalProblem"."userId" = ${userId}
          )
          ORDER BY random()
          LIMIT 2;
        `
  } else {
    ids = await prisma.$queryRaw`
          SELECT id
          FROM "GlobalProblem"
          ORDER BY random()
          LIMIT 2;
        `
  }
  const where = []
  for (let i = 0; i < ids.length; i++) {
    where.push(ids[i].id)
  }
  return prisma.globalProblem.findMany({
    where: {
      id: {
        in: where,
      },
    },
  })
}

export async function getAllRandomGlobalProblemPairs() {
  let randomPairs: GlobalProblem[][] = []
  const globalProblems = await prisma.globalProblem.findMany()
  for (let i = 0; i < globalProblems.length; i += 2) {
    randomPairs.push([globalProblems[i], globalProblems[i + 1]])
  }
  return randomPairs
}

export async function aggregateGlobalProblemPairAllocations() {
  const allocations = await prisma.globalProblemPairAllocation.findMany()
  const normalizedAllocations = aggregateByTotalShare(
    allocations.map((allocation) => ({
      thisId: allocation.thisGlobalProblemId,
      thatId: allocation.thatGlobalProblemId,
      thisPercentage: allocation.thisGlobalProblemPercentage,
    }))
  )
  const results = []
  for (const problemId in normalizedAllocations) {
    const result = await prisma.globalProblem.update({
      where: { id: problemId },
      data: { averageAllocation: normalizedAllocations[problemId] },
    })
    results.push(result)
  }
  return results
}

export async function updateOrCreateGlobalProblemPairAllocation(
  thisGlobalProblemId: string,
  thatGlobalProblemId: string,
  thisGlobalProblemPercentage: number,
  userId: string
) {
  const result = await prisma.globalProblemPairAllocation.upsert({
    where: {
      userId_thisGlobalProblemId_thatGlobalProblemId: {
        userId: userId,
        thisGlobalProblemId: thisGlobalProblemId,
        thatGlobalProblemId: thatGlobalProblemId,
      },
    },
    update: {
      thisGlobalProblemPercentage,
    },
    create: {
      thisGlobalProblemId,
      thatGlobalProblemId,
      thisGlobalProblemPercentage,
      userId,
    },
  })
  await aggregateGlobalProblemPairAllocations()
  return result
}

export async function createGlobalProblem(
  name: string,
  description: string,
  content: string,
  featuredImage: string | undefined,
  userId: string
) {
  return prisma.globalProblem.create({
    data: {
      id: createSlug(name),
      name,
      description,
      content,
      featuredImage,
      userId,
    },
  })
}
