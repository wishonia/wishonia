import { GlobalSolution } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma as db } from "@/lib/db"

export async function getGlobalSolution(
  globalSolutionId: GlobalSolution["id"]
) {
  return db.globalSolution.findFirst({
    where: {
      id: globalSolutionId,
    },
  })
}

// Verify if the user has access to the globalSolution
export async function verifyGlobalSolution(globalSolutionId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.globalSolution.count({
    where: {
      id: globalSolutionId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
