import { GlobalProblem } from "@prisma/client"
import { prisma as db } from "@/lib/db"

// Fetch user's globalProblem
export async function getGlobalProblem(
  globalProblemId: GlobalProblem["id"],
) {
  return db.globalProblem.findFirst({
    where: {
      id: globalProblemId,
    },
  });
}
