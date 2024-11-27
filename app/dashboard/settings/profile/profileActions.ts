"use server"

import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

import { userSchema } from "./userSchema"

type UpdateUserData = {
  id: string
} & Prisma.UserUpdateInput

export async function updateUser(data: UpdateUserData) {
  // First get the id before validation
  const { id, ...dataToValidate } = data

  // Validate the update data (excluding id)
  const validatedData = userSchema.parse(dataToValidate)

  // Convert the data to match Prisma's expected format
  const updateData: Prisma.UserUpdateInput = Object.entries(
    validatedData
  ).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value === null ? undefined : value,
    }),
    {}
  )

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/profile")

  return updatedUser
}
