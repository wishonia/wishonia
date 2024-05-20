import { PrismaClient, GlobalProblem } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
    try {
        const globalProblems = await prisma.globalProblem.findMany();
        return new Response(JSON.stringify(globalProblems))
    } catch (error) {
        return new Response(null, { status: 500 })
    }
}