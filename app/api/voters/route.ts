import { prisma as db } from "@/lib/db"
import {getUserIdServer} from "@/lib/api/getUserIdServer";
import {handleError} from "@/lib/errorHandler";

export async function GET() {
  try {
    const userId = await getUserIdServer();

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
    return handleError(error)
  }
}