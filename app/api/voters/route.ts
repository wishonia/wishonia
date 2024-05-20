import { db } from "@/lib/db"
import {getUserId} from "@/lib/api/getUserId";

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new Response("Unauthorized", { status: 403 })
    }

    // Get all of current user's wishingWells
    const voters = await db.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true,
      },
      where: {
        referrerUserId: userId,
      },
    })

    return new Response(JSON.stringify(voters))
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}