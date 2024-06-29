import * as z from "zod"

import { verifyGlobalSolution } from "@/lib/api/globalSolutions"
import { prisma as db } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import { globalSolutionPatchSchema } from "@/lib/validations/globalSolution"

const routeContextSchema = z.object({
  params: z.object({
    globalSolutionId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyGlobalSolution(params.globalSolutionId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = globalSolutionPatchSchema.parse(json)

    // Update the globalSolution
    await db.globalSolution.update({
      where: {
        id: params.globalSolutionId,
      },
      data: {
        name: body.name,
        description: body.description,
        updatedAt: new Date(),
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return handleError(error)
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyGlobalSolution(params.globalSolutionId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the globalSolution
    await db.globalSolution.delete({
      where: {
        id: params.globalSolutionId as string,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return handleError(error)
  }
}
