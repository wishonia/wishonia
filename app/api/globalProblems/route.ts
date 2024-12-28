import {getUserIdServer} from "@/lib/api/getUserIdServer";
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import {generateAndSaveGlobalProblem} from "@/lib/globalProblemGenerator";

export async function GET() {
  try {
    const globalProblems = await prisma.globalProblem.findMany()
    return new Response(JSON.stringify(globalProblems))
  } catch (error) {
    return handleError(error)
  }
}


export async function POST(request: Request) {
  const userId = await getUserIdServer()
  if (!userId) {
    return new Response(
        JSON.stringify({
          message: "You need to be logged in to create a global solution",
        })
    )
  }
  try {
    const body = await request.json()
    debugger
    const globalProblem =
        await generateAndSaveGlobalProblem(body.name, userId, body.description)
    return new Response(JSON.stringify(globalProblem))
  } catch (error) {
    return handleError(error)
  }
}