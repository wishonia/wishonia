import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const data = await req.json()
    const { provider } = data

    if (!provider) {
      return new NextResponse("Provider is required", { status: 400 })
    }

    // Delete the account connection
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    })

    return new NextResponse("Account disconnected", { status: 200 })
  } catch (error) {
    console.error("Error disconnecting account:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
