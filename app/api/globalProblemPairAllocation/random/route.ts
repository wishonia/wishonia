import {getUserId} from "@/lib/api/getUserId";
import {getRandomGlobalProblemPair} from "@/lib/globalProblems";
import {handleError} from "@/lib/errorHandler";
export async function GET() {
    try {
        const userId = await getUserId();
        let randomPair = await getRandomGlobalProblemPair(userId);
        return new Response(JSON.stringify({
          thisGlobalProblem: randomPair[0],
          thatGlobalProblem: randomPair[1],
        }))
    } catch (error) {
        return handleError(error,
            'Could not get random global problem pair because:')
    }
}