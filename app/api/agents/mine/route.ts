import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import { getCurrentUser } from "@/lib/session"
export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const records = await prisma.agent.findMany({
      where: {
        userId: currentUser.id,
      },
    })
    return new Response(JSON.stringify(records))
  } catch (error) {
    return handleError(error)
  }
}