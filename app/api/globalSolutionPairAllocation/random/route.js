import {getUserIdServer} from "@/lib/api/getUserIdServer";
import {getRandomGlobalSolutionPair} from "@/lib/globalSolutions";
import {handleError} from "@/lib/errorHandler";


export async function GET() {
    try {
        const userId = await getUserIdServer();
        let randomPair = await getRandomGlobalSolutionPair(userId);
        return new Response(JSON.stringify({
          thisGlobalSolution: randomPair[0],
          thatGlobalSolution: randomPair[1],
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleError(error, `Could not get random global solution pair because:`);
    }
}