import * as z from "zod"
import { prisma as db } from "@/lib/db"
import {getCurrentUser} from "@/lib/session";

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function GET(
    req: Request,
    context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context)

  try {
    const session = await getCurrentUser()

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const voters = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
      },
      where: {
        referrerUserId: params.userId,
      },
    })

    return new Response(JSON.stringify(voters))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}