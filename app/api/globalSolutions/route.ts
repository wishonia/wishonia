import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
import {getUserIdServer} from "@/lib/api/getUserIdServer";
import {generateGlobalSolution} from "@/lib/globalSolutionsGenerator";
export async function GET() {
    try {
        const globalSolutions = await prisma.globalSolution.findMany();
        return new Response(JSON.stringify(globalSolutions))
    } catch (error) {
        return handleError(error)
    }
}

export async function POST(request: Request) {
    const userId = await getUserIdServer();
    if(!userId) {
        return new Response(JSON.stringify({message: "You need to be logged in to create a global solution"}))
    }
    try {
        const body = await request.json()
        const globalSolution = await generateGlobalSolution(body.name, null, userId)
        return new Response(JSON.stringify(globalSolution))
    } catch (error) {
        return handleError(error)
    }
}