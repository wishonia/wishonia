
import { prisma } from "@/lib/db"
import { aggregateByAverageShare } from "@/lib/pairwiseAllocation"

async function getGlobalProblemSolutionPairAllocations(
  globalProblemId: string
) {
  return prisma.globalProblemSolutionPairAllocation.findMany({
    where: {
      globalProblemId: globalProblemId,
    },
  })
}

export async function aggregateGlobalProblemSolutionPairAllocationsForProblem(
  globalProblemId: string
) {
  const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
    where: { globalProblemId: globalProblemId },
  })
  const globalProblemSolutionAllocations =
    await getGlobalProblemSolutionPairAllocations(globalProblemId)
  const normalizedAllocationToEachGlobalProblemSolution =
    aggregateByAverageShare(
      globalProblemSolutionAllocations.map((allocation) => ({
        thisId: allocation.thisGlobalProblemSolutionId,
        thatId: allocation.thatGlobalProblemSolutionId,
        thisPercentage: allocation.thisGlobalProblemSolutionPercentage,
      })),
      globalProblemSolutions.map(({ id }) => id)
    )
  for (const globalProblemSolution of globalProblemSolutions) {
    const averageAllocation =
      normalizedAllocationToEachGlobalProblemSolution[globalProblemSolution.id]
    await prisma.globalProblemSolution.update({
      where: { id: globalProblemSolution.id },
      data: { averageAllocation: averageAllocation },
    })
  }
}

export async function aggregateGlobalProblemSolutionPairAllocations() {
  const globalProblemIds = await prisma.globalProblem.findMany({
    select: { id: true },
  })
  for (const globalProblemId of globalProblemIds) {
    await aggregateGlobalProblemSolutionPairAllocationsForProblem(
      globalProblemId.id
    )
  }
}

export async function updateOrCreateGlobalProblemSolutionPairAllocation(
  thisGlobalProblemSolutionId: string,
  thatGlobalProblemSolutionId: string,
  thisGlobalProblemSolutionPercentage: number,
  userId: string
) {
  const thisGlobalProblemSolution =
    await prisma.globalProblemSolution.findUnique({
      where: { id: thisGlobalProblemSolutionId },
    })
  const thatGlobalProblemSolution =
    await prisma.globalProblemSolution.findUnique({
      where: { id: thatGlobalProblemSolutionId },
    })

  if (!thisGlobalProblemSolution || !thatGlobalProblemSolution) {
    throw new Error("Invalid global problem solution id")
  }
  if (
    thisGlobalProblemSolutionPercentage < 0 ||
    thisGlobalProblemSolutionPercentage > 100
  ) {
    throw new Error("Invalid percentage")
  }
  if (
    thisGlobalProblemSolution.globalProblemId !==
    thatGlobalProblemSolution.globalProblemId
  ) {
    throw new Error(
      "Global problem solutions must belong to the same global problem"
    )
  }
  const globalProblemId = thisGlobalProblemSolution.globalProblemId
  const existingAllocation =
    await prisma.globalProblemSolutionPairAllocation.findFirst({
      where: {
        globalProblemId: globalProblemId,
        thisGlobalProblemSolutionId: thisGlobalProblemSolutionId,
        thatGlobalProblemSolutionId: thatGlobalProblemSolutionId,
        userId: userId,
      },
    })
  if (existingAllocation) {
    return prisma.globalProblemSolutionPairAllocation.update({
      where: { id: existingAllocation.id },
      data: { thisGlobalProblemSolutionPercentage },
    })
  }
  const result = prisma.globalProblemSolutionPairAllocation.create({
    data: {
      globalProblemId,
      thisGlobalProblemSolutionId,
      thatGlobalProblemSolutionId,
      thisGlobalProblemSolutionPercentage,
      userId,
    },
  })
  await aggregateGlobalProblemSolutionPairAllocationsForProblem(globalProblemId)
  return result
}
