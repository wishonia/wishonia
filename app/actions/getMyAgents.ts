"use server"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function getMyAgents() {
  const currentUser = await getCurrentUser()
  if (!currentUser || !currentUser.id) {
    throw new Error("Unauthorized")
  }

  const records = await prisma.agent.findMany({
    where: {
      userId: currentUser.id,
    },
  })

  return records
} 