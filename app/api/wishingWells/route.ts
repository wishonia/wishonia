import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const wishingWellCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Get all of current user's wishingWells
    const wishingWells = await db.wishingWell.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
      where: {
        userId: session.user.id,
      },
    })

    return new Response(JSON.stringify(wishingWells))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Create a new wishing well for authenticated user
    const json = await req.json()
    const body = wishingWellCreateSchema.parse(json)

    const wishingWell = await db.wishingWell.create({
      data: {
        name: body.name,
        description: body.description,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(wishingWell))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
