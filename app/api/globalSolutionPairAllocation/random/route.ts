import {getRandomGlobalSolutionPair} from "./serverRoute";


export async function GET() {
    try {
        const userId = await getUserIdServer();
        const randomPair = await getRandomGlobalSolutionPair(userId);
        return new Response(JSON.stringify(randomPair));
    } catch (error) {
        return handleError(error, `Could not get random global solution pair because:`);
    }
}