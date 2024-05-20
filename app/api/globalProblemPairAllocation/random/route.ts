import {getUserId} from "@/lib/api/getUserId";
import { PrismaClient, GlobalProblem } from '@prisma/client';
import {getRandomGlobalProblemPair} from "@/lib/globalProblems";
const prisma = new PrismaClient();



export async function GET() {
    try {
        const userId = await getUserId();
        let randomPair = await getRandomGlobalProblemPair(userId);
        return new Response(JSON.stringify({
          thisGlobalProblem: randomPair[0],
          thatGlobalProblem: randomPair[1],
        }))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}