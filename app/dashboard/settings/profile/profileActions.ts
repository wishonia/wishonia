"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

import { userSchema } from "./userSchema"

// Define a type that properly handles JSON fields
type UpdateUserData = {
  id: string
  badges?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput
} & Omit<Prisma.UserUpdateInput, "badges">

export async function updateUser(data: UpdateUserData) {
  try {
    const { id, ...updateData } = data

    const validatedData = userSchema.parse(updateData)

    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath("/dashboard/settings/profile")
    return { success: true, data: updatedUser }
  } catch (error) {
    // Handle validation errors separately
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { success: false, error: "Database error occurred" }
    }
    return { success: false, error: "Failed to update user" }
  }
}
