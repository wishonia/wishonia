import { GlobalProblem } from "@prisma/client"

import { prisma } from "@/lib/db"
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
  const randomPairs: GlobalProblem[][] = []
  const globalProblems = await prisma.globalProblem.findMany()
  for (let i = 0; i < globalProblems.length; i += 2) {
    randomPairs.push([globalProblems[i], globalProblems[i + 1]])
  }
  return randomPairs
}

export async function aggregateGlobalProblemPairAllocations() {
  const allocations = await prisma.globalProblemPairAllocation.findMany()
  const problemAllocations: Record<string, number> = {}
  // Sum up the percentages for each problem
  for (const allocation of allocations) {
    const {
      thisGlobalProblemId,
      thatGlobalProblemId,
      thisGlobalProblemPercentage,
    } = allocation

    problemAllocations[thisGlobalProblemId] =
      (problemAllocations[thisGlobalProblemId] || 0) +
      thisGlobalProblemPercentage
    problemAllocations[thatGlobalProblemId] =
      (problemAllocations[thatGlobalProblemId] || 0) +
      (100 - thisGlobalProblemPercentage)
  }

  const totalAllocations = Object.values(problemAllocations).reduce(
    (sum, allocation) => sum + allocation,
    0
  )

  // Normalize the allocations to ensure they add up to 100%
  const normalizedAllocations: Record<string, number> = {}
  for (const problemId in problemAllocations) {
    normalizedAllocations[problemId] =
      (problemAllocations[problemId] / totalAllocations) * 100
  }
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
