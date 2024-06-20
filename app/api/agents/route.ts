import { prisma } from "@/lib/db";
import {handleError} from "@/lib/errorHandler";
export async function GET() {
    try {
        const records = await prisma.agent.findMany();
        return new Response(JSON.stringify(records))
    } catch (error) {
        return handleError(error)
    }
}