import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Get all of current user's activities
    const voters = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
      },
      where: {
        referrerUserId: session.user.id,
      },
    })

    return new Response(JSON.stringify(voters))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}