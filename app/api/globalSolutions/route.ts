import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
export async function GET() {
    try {
        const globalSolutions = await prisma.globalSolution.findMany();
        return new Response(JSON.stringify(globalSolutions))
    } catch (error) {
        return handleError(error)
    }
}