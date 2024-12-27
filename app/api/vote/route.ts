import { NextResponse } from "next/server"

import { handleError } from "@/lib/errorHandler"
import { updateOrCreateGlobalProblemSolutionPairAllocation } from "@/lib/globalProblemSolutionPairAllocations"
import { updateOrCreateGlobalProblemPairAllocation } from "@/lib/globalProblems"
import { updateOrCreateGlobalSolutionPairAllocation } from "@/lib/globalSolutions"
import { getCurrentUser } from "@/lib/session"
import { saveReferrerUserId } from "@/lib/user"
import { updateOrCreateWishingWellPairAllocation } from "@/lib/wishingWells"

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const body = await req.json()
    const userId = currentUser.id
    const {
      wishingWellPairAllocation,
      referrerUserId,
      globalProblemPairAllocation,
      globalSolutionPairAllocation,
      globalProblemSolutionPairAllocation,
    } = body
    if (referrerUserId) {
      await saveReferrerUserId(referrerUserId, currentUser)
    }
    if (wishingWellPairAllocation) {
      wishingWellPairAllocation.userId = currentUser.id
      try {
        body.wishingWellPairAllocation =
          await updateOrCreateWishingWellPairAllocation(
            wishingWellPairAllocation.thisWishingWellId,
            wishingWellPairAllocation.thatWishingWellId,
            wishingWellPairAllocation.thisWishingWellPercentage,
            userId
          )
      } catch (error) {
        return handleError(
          error,
          "Could not save globalProblemPairAllocation because:",
          {
            error,
            globalProblemPairAllocation,
          }
        )
      }
    }
    if (globalProblemPairAllocation) {
      globalProblemPairAllocation.userId = userId
      try {
        body.globalProblemPairAllocation =
          await updateOrCreateGlobalProblemPairAllocation(
            globalProblemPairAllocation.thisGlobalProblemId,
            globalProblemPairAllocation.thatGlobalProblemId,
            globalProblemPairAllocation.thisGlobalProblemPercentage,
            userId
          )
      } catch (error) {
        return handleError(
          error,
          "Could not save globalProblemPairAllocation because:",
          {
            error,
            globalProblemPairAllocation,
          }
        )
      }
    }
    if (globalSolutionPairAllocation) {
      globalSolutionPairAllocation.userId = userId
      try {
        body.globalSolutionPairAllocation =
          await updateOrCreateGlobalSolutionPairAllocation(
            globalSolutionPairAllocation.thisGlobalSolutionId,
            globalSolutionPairAllocation.thatGlobalSolutionId,
            globalSolutionPairAllocation.thisGlobalSolutionPercentage,
            userId
          )
      } catch (error) {
        return handleError(
          error,
          "Could not save globalSolutionPairAllocation because:",
          {
            error,
            globalSolutionPairAllocation,
          }
        )
      }
    }
    if (globalProblemSolutionPairAllocation) {
      globalProblemSolutionPairAllocation.userId = userId
      try {
        body.globalProblemSolutionPairAllocation =
          await updateOrCreateGlobalProblemSolutionPairAllocation(
            globalProblemSolutionPairAllocation.thisGlobalProblemSolutionId,
            globalProblemSolutionPairAllocation.thatGlobalProblemSolutionId,
            globalProblemSolutionPairAllocation.thisGlobalProblemSolutionPercentage,
            userId
          )
      } catch (error) {
        return handleError(
          error,
          "Could not save globalProblemSolutionPairAllocation because:",
          {
            error,
            globalProblemSolutionPairAllocation,
          }
        )
      }
    }

    return NextResponse.json(body, { status: 201 })
  } catch (error) {
    return handleError(error, "Could not save vote because:", {
      error,
    })
  }
}
