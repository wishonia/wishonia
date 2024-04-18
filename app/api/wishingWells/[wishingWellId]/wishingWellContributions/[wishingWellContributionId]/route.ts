import * as z from "zod"

import { verifyWishingWell } from "@/lib/api/wishingWells"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    wishingWellId: z.string(),
    wishingWellContributionId: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    if (!(await verifyWishingWell(params.wishingWellId))) {
      return new Response(null, { status: 403 })
    }

    // Delete the log
    await db.wishingWellContribution.delete({
      where: {
        id: params.wishingWellContributionId as string,
        wishingWell: {
          id: params.wishingWellId as string,
        },
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
