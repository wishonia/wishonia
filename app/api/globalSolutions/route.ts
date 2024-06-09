import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const globalSolutions = await prisma.globalSolution.findMany();
        return new Response(JSON.stringify(globalSolutions))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}