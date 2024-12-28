import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { handleError } from "@/lib/errorHandler"
import { getRandomGlobalProblemPair } from "@/lib/globalProblems"

export async function GET() {
  try {
    const userId = await getUserIdServer()
    const randomPair = await getRandomGlobalProblemPair(userId)
    return new Response(
      JSON.stringify({
        thisGlobalProblem: randomPair[0],
        thatGlobalProblem: randomPair[1],
      })
    )
  } catch (error) {
    return handleError(
      error,
      "Could not get random global problem pair because:"
    )
  }
}
