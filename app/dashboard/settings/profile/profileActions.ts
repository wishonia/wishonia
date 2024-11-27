"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/prisma"

import { userSchema } from "./userSchema"

export async function updateUser(data: any) {
  const validatedData = userSchema.parse(data)

  const updatedUser = await prisma.user.update({
    where: { id: data.id },
    data: validatedData as any,
  })

  revalidatePath("/profile")

  return updatedUser
}
