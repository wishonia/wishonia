import {getUserId} from "@/lib/api/getUserId";
import {getRandomGlobalProblemSolutionPair} from "@/lib/globalProblemSolutions";
import {handleError} from "@/lib/errorHandler";
import * as z from "zod";
const routeContextSchema = z.object({
    params: z.object({
        globalProblemId: z.string(),
    }),
})

export async function GET(    req: Request,
                              context: z.infer<typeof routeContextSchema>) {
    try {
        const userId = await getUserId();
        const { params } = routeContextSchema.parse(context)
        const globalProblemId = params.globalProblemId;
        let randomPair = await getRandomGlobalProblemSolutionPair(globalProblemId, userId);
        return new Response(JSON.stringify({
          thisGlobalProblemSolution: randomPair[0],
          thatGlobalProblemSolution: randomPair[1],
        }))
    } catch (error) {
        return handleError(error, `Could not get random global solution pair because:`);
    }
}