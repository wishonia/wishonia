import * as z from "zod"

import { verifyWishingWell } from "@/lib/api/wishingWells"
import { prisma as db } from "@/lib/db"
import {getCurrentUser} from "@/lib/session";

const wishingWellContributionCreateSchema = z.object({
  date: z.string(),
  count: z.number(),
})

const routeContextSchema = z.object({
  params: z.object({
    wishingWellId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getCurrentUser()
    const { params } = routeContextSchema.parse(context)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    if (!(await verifyWishingWell(params.wishingWellId))) {
      return new Response(null, { status: 403 })
    }

    // Get all of wishingWellContributions for the wishingWell
    const wishingWellContributions = await db.wishingWellContribution.findMany({
      select: {
        id: true,
        date: true,
        count: true,
      },
      where: {
        wishingWellId: params.wishingWellId,
      },
    })

    return new Response(JSON.stringify(wishingWellContributions))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const session = await getCurrentUser();
    const { params } = routeContextSchema.parse(context)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    if (!(await verifyWishingWell(params.wishingWellId))) {
      return new Response(null, { status: 403 })
    }

    const json = await req.json()
    const body = wishingWellContributionCreateSchema.parse(json)

    const existingContribution = await db.wishingWellContribution.findFirst({
      where: {
        date: body.date,
        wishingWellId: params.wishingWellId,
      },
    })

    if (existingContribution) {
      const updatedContribution = await db.wishingWellContribution.update({
        where: { id: existingContribution.id },
        data: {
          count: existingContribution.count + body.count,
        },
        select: {
          id: true,
        },
      })

      return new Response(JSON.stringify(updatedContribution))
    }

    // Create a new contribution for the selected wishingWell if no contribution exists
    const wishingWellContributions = await db.wishingWellContribution.create({
      data: {
        date: body.date,
        count: body.count,
        wishingWellId: params.wishingWellId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(wishingWellContributions))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
