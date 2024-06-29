import {
  GlobalProblem,
  GlobalProblemSolution,
  GlobalProblemSolutionPairAllocation,
} from "@prisma/client"

import { prisma } from "@/lib/db"

async function getRandomGlobalProblemSolutionsForUser(
  globalProblemId: string,
  userId: string
): Promise<{ id: string }[]> {
  const existingAllocations =
    await prisma.globalProblemSolutionPairAllocation.findMany({
      where: {
        globalProblemId: globalProblemId,
        userId: userId,
      },
      select: {
        thisGlobalProblemSolutionId: true,
        thatGlobalProblemSolutionId: true,
      },
    })
  return prisma.globalProblemSolution.findMany({
    where: {
      globalProblemId: globalProblemId,
      id: {
        notIn: existingAllocations.map(
          (allocation) => allocation.thisGlobalProblemSolutionId
        ),
      },
    },
    orderBy: {
      id: "asc",
    },
    take: 2,
  })
}

async function getRandomGlobalProblemSolutionsAnonymous(
  globalProblemId: string
): Promise<{ id: string }[]> {
  return prisma.$queryRaw`
        SELECT id
        FROM "GlobalProblemSolution"
        WHERE "globalProblemId" = ${globalProblemId}
        ORDER BY random()
        LIMIT 2;
    `
}

function createWhereClause(ids: { id: string }[]) {
  const where = []
  for (let i = 0; i < ids.length; i++) {
    where.push(ids[i].id)
  }
  return where
}

export async function getRandomGlobalProblemSolutionPair(
  globalProblemId: string,
  userId: string | undefined
) {
  let ids: { id: string }[]
  if (userId) {
    ids = await getRandomGlobalProblemSolutionsForUser(globalProblemId, userId)
  } else {
    ids = await getRandomGlobalProblemSolutionsAnonymous(globalProblemId)
  }
  const where = createWhereClause(ids)
  return prisma.globalProblemSolution.findMany({
    where: {
      id: {
        in: where,
      },
    },
  })
}

export async function getAllRandomGlobalProblemSolutionPairs() {
  const globalProblems = await prisma.globalProblem.findMany()
  const pairs: {
    thisGlobalProblemSolution: GlobalProblemSolution
    thatGlobalProblemSolution: GlobalProblemSolution
    globalProblem: GlobalProblem
  }[] = []
  // Loop through all global problems and get random pairs of global problem solutions
  for (const globalProblem of globalProblems) {
    const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
      where: {
        globalProblemId: globalProblem.id,
      },
    })
    for (let i = 0; i < globalProblemSolutions.length; i++) {
      for (let j = i + 1; j < globalProblemSolutions.length; j++) {
        pairs.push({
          thisGlobalProblemSolution: globalProblemSolutions[i],
          thatGlobalProblemSolution: globalProblemSolutions[j],
          globalProblem: globalProblem,
        })
      }
    }
  }
  return pairs
}

export async function deleteGlobalProblemSolution(
  globalProblemName: string,
  globalSolutionName: string
) {
  const globalProblem = await prisma.globalProblem.findFirst({
    where: { name: globalProblemName },
  })
  if (!globalProblem) {
    throw new Error("Global problem not found")
  }
  const globalSolution = await prisma.globalSolution.findFirst({
    where: { name: globalSolutionName },
  })
  if (!globalSolution) {
    throw new Error("Global solution not found")
  }
  // Delete the global problem solution and related pair allocations
  const globalProblemSolution = await prisma.globalProblemSolution.findFirst({
    where: {
      globalProblemId: globalProblem.id,
      globalSolutionId: globalSolution.id,
    },
  })
  if (!globalProblemSolution) {
    throw new Error("Global problem solution not found")
  }
  await prisma.globalProblemSolutionPairAllocation.deleteMany({
    where: {
      thisGlobalProblemSolutionId: globalProblemSolution.id,
    },
  })
  await prisma.globalProblemSolutionPairAllocation.deleteMany({
    where: {
      thatGlobalProblemSolutionId: globalProblemSolution.id,
    },
  })
  await prisma.globalProblemSolution.delete({
    where: { id: globalProblemSolution.id },
  })
}

export async function deleteAllGlobalProblemSolutionsForProblem(
  globalProblemName: string
) {
  const globalProblem = await prisma.globalProblem.findFirst({
    where: { name: globalProblemName },
  })
  if (!globalProblem) {
    throw new Error("Global problem not found")
  }
  const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
    where: { globalProblemId: globalProblem.id },
  })
  for (const globalProblemSolution of globalProblemSolutions) {
    await prisma.globalProblemSolutionPairAllocation.deleteMany({
      where: {
        thisGlobalProblemSolutionId: globalProblemSolution.id,
      },
    })
    await prisma.globalProblemSolutionPairAllocation.deleteMany({
      where: {
        thatGlobalProblemSolutionId: globalProblemSolution.id,
      },
    })
    await prisma.globalProblemSolution.delete({
      where: { id: globalProblemSolution.id },
    })
  }
}

export async function deleteGlobalProblemSolutionById(id: string) {
  await prisma.globalProblemSolutionPairAllocation.deleteMany({
    where: {
      thisGlobalProblemSolutionId: id,
    },
  })
  await prisma.globalProblemSolutionPairAllocation.deleteMany({
    where: {
      thatGlobalProblemSolutionId: id,
    },
  })
  await prisma.globalProblemSolution.delete({
    where: { id },
  })
}
