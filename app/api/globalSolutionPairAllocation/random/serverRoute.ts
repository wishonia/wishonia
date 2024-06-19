import {getUserIdServer} from "@/lib/api/getUserIdServer";
import {getRandomGlobalSolutionPair as getRandomPair} from "@/lib/globalSolutions";
import {handleError} from "@/lib/errorHandler";

export async function getRandomGlobalSolutionPair(userId: string | undefined) {
    try {
        let randomPair = await getRandomPair(userId);
        return {
            thisGlobalSolution: randomPair[0],
            thatGlobalSolution: randomPair[1],
        };
    } catch (error) {
        throw handleError(error, `Could not get random global solution pair because:`);
    }
}