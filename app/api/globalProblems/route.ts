import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const globalProblems = await prisma.globalProblem.findMany();
        return new Response(JSON.stringify(globalProblems))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}