"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateUserEmailSettings(settings: {
  marketingEmails: boolean
  newsletterEmails: boolean
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Must be signed in to update settings")
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: settings,
  })

  revalidatePath("/settings/notifications")
}

export async function unsubscribeFromAll(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      unsubscribeFromAll: true,
      marketingEmails: false,
      newsletterEmails: false,
      petitionFollows: {
        updateMany: {
          where: {},
          data: {
            notifyOnComment: false,
            notifyOnMilestone: false,
            notifyOnUpdate: false,
            notifyOnSignature: false,
            emailFrequency: "NEVER",
          },
        },
      },
    },
  })

  revalidatePath("/settings/notifications")
}
