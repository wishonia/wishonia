import { GlobalSolution } from "@prisma/client"
import { prisma as db } from "@/lib/db"

export async function getGlobalSolution(
  globalSolutionId: GlobalSolution["id"],
) {
  return db.globalSolution.findFirst({
    where: {
      id: globalSolutionId,
    },
  });
}