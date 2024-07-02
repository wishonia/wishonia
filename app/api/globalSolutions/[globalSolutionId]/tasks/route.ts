import * as z from "zod"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"

const routeContextSchema = z.object({
  params: z.object({
    globalSolutionId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context)
  const globalSolutionId = params.globalSolutionId

  const globalSolutionTasks = await prisma.globalSolutionTask.findMany({
    where: {
      globalSolutionId,
    },
    include: {
      globalTask: true,
    },
  })
  const globalTasks = globalSolutionTasks.map((gst) => gst.globalTask)

  return new Response(JSON.stringify(globalTasks))
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const userId = await getUserIdServer()
  if (!userId) {
    return new Response(
      JSON.stringify({
        message: "You need to be logged in to create a global solution",
      })
    )
  }
  const { params } = routeContextSchema.parse(context)
  const globalSolutionId = params.globalSolutionId
  const body = await req.json()
  try {
    const globalTask = await prisma.globalTask.create({
      data: body,
    })
    await prisma.globalSolutionTask.create({
      data: {
        globalSolutionId,
        globalTaskId: globalTask.id,
      },
    })
    return new Response(JSON.stringify(globalTask))
  } catch (error) {
    return handleError(error)
  }
}
