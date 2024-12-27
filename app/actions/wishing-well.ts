"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"

import { prisma } from "@/lib/prisma"

export interface UpdateWishingWellData {
  id: string
  name: string
  description?: string | null
  content?: string | null
  featuredImage?: string | null
  images?: string[]
}

export async function updateWishingWell(data: UpdateWishingWellData) {
  const session = await getServerSession()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const wishingWell = await prisma.wishingWell.findUnique({
    where: { id: data.id },
    select: { userId: true },
  })

  if (!wishingWell || wishingWell.userId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  await prisma.wishingWell.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      content: data.content,
      featuredImage: data.featuredImage,
      images: data.images,
    },
  })

  revalidatePath(`/wishingWell/${data.id}`)
  revalidatePath(`/wishingWell/${data.id}/edit`)
} 