import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"

export async function GET() {
  try {
    const globalProblems = await prisma.globalProblem.findMany()
    return new Response(JSON.stringify(globalProblems))
  } catch (error) {
    return handleError(error)
  }
}
