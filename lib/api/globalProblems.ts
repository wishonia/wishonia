import { cache } from "react"
import { GlobalProblem } from "@prisma/client"

import { prisma as db } from "@/lib/db"

// Fetch user's globalProblem. The layout, metadata and page of one request share a single query.
export const getGlobalProblem = cache(async (globalProblemId: GlobalProblem["id"]) => {
  return db.globalProblem.findFirst({
    where: {
      id: globalProblemId,
    },
  })
})
