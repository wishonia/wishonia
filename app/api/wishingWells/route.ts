import * as z from "zod"
import { prisma as db } from "@/lib/db"
import {getUserIdServer} from "@/lib/api/getUserIdServer";
import {handleError} from "@/lib/errorHandler";

const wishingWellCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const wishingWells = await db.wishingWell.findMany()
    return new Response(JSON.stringify(wishingWells))
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdServer();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = wishingWellCreateSchema.parse(json)

    const wishingWell = await db.wishingWell.create({
      data: {
        name: body.name,
        description: body.description,
        userId: userId,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(wishingWell))
  } catch (error) {
    return handleError(error)
  }
}
