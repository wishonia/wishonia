import { GlobalProblemSolution } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export async function getGlobalProblemSolution(
  globalProblemId: string,
  globalSolutionId: string,
) {
  return await prisma.globalProblemSolution.findFirst({
    where: {
      globalProblemId,
      globalSolutionId,
    },
    include: {
      globalProblem: true,
      globalSolution: true,
    },
  })
}

export async function getGlobalProblemSolutionById(
  globalProblemSolutionId: GlobalProblemSolution["id"]
) {
  return prisma.globalProblemSolution.findFirst({
    where: {
      id: globalProblemSolutionId,
    },
    include: {
      globalProblem: true,
      globalSolution: true,
    },
  })
}
