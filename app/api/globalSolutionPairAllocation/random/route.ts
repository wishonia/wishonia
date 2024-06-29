import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { handleError } from "@/lib/errorHandler"
import { getRandomGlobalSolutionPair } from "@/lib/globalSolutions"

export async function GET() {
  try {
    const userId = await getUserIdServer()
    let randomPair = await getRandomGlobalSolutionPair(userId)
    return new Response(
      JSON.stringify({
        thisGlobalSolution: randomPair[0],
        thatGlobalSolution: randomPair[1],
      })
    )
  } catch (error) {
    return handleError(
      error,
      `Could not get random global solution pair because:`
    )
  }
}
