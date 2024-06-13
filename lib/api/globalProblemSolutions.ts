import { GlobalProblemSolution } from "@prisma/client"
import { prisma as db } from "@/lib/db"

export async function getGlobalProblemSolution(
  globalProblemId: GlobalProblemSolution["globalProblemId"],
  globalSolutionId: GlobalProblemSolution["globalSolutionId"],
) {
  return db.globalProblemSolution.findFirst({
    where: {
      globalProblemId: globalProblemId,
        globalSolutionId: globalSolutionId,
    },
  });
}


export async function getGlobalProblemSolutionById(
    globalProblemSolutionId: GlobalProblemSolution["id"],
) {
  return db.globalProblemSolution.findFirst({
    where: {
      id: globalProblemSolutionId
    },
  });
}
