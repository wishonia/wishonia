import * as z from "zod"

import { verifyWishingWell } from "@/lib/api/wishingWells"
import { prisma as db } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import { wishingWellPatchSchema } from "@/lib/validations/wishingWell"

const routeContextSchema = z.object({
  params: z.object({
    wishingWellId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyWishingWell(params.wishingWellId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = wishingWellPatchSchema.parse(json)

    // Update the wishingWell
    await db.wishingWell.update({
      where: {
        id: params.wishingWellId,
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

    if (!(await verifyWishingWell(params.wishingWellId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the wishingWell
    await db.wishingWell.delete({
      where: {
        id: params.wishingWellId as string,
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
