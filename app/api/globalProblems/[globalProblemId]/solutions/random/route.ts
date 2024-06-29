import * as z from "zod"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { handleError } from "@/lib/errorHandler"
import { getRandomGlobalProblemSolutionPair } from "@/lib/globalProblemSolutions"

const routeContextSchema = z.object({
  params: z.object({
    globalProblemId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const userId = await getUserIdServer()
    const { params } = routeContextSchema.parse(context)
    const globalProblemId = params.globalProblemId
    let randomPair = await getRandomGlobalProblemSolutionPair(
      globalProblemId,
      userId
    )
    return new Response(
      JSON.stringify({
        thisGlobalProblemSolution: randomPair[0],
        thatGlobalProblemSolution: randomPair[1],
      })
    )
  } catch (error) {
    return handleError(
      error,
      `Could not get random global solution pair because:`
    )
  }
}
