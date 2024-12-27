import * as z from "zod"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import {createGlobalProblemSolution} from "@/lib/globalProblemSolutionGenerator";

const routeContextSchema = z.object({
  params: z.object({
    globalProblemId: z.string(),
  }),
})

const requestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  content: z.string().optional(),
  featuredImageUrl: z.string().optional(),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const userId = await getUserIdServer()
    const { params } = routeContextSchema.parse(context)
    const globalProblemId = params.globalProblemId
    const body = await req.json()
    const { name, description, content, featuredImageUrl } =
      requestSchema.parse(body)

    const globalProblem = await prisma.globalProblem.findUnique({
      where: {
        id: globalProblemId,
      },
    })

    if (!globalProblem) {
      return new Response(JSON.stringify({ error: "Global problem not found" }), { status: 404 })
    }

    const createdSolution = await createGlobalProblemSolution(
      name,
      description,
      globalProblem
    )

    return new Response(JSON.stringify(createdSolution), { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}