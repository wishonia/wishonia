'use server'
import prisma from "@/lib/prisma"
import { userSchema } from "./userSchema"
import { revalidatePath } from "next/cache"

export async function updateUser(data: any) {
    debugger
    const validatedData = userSchema.parse(data);

    const updatedUser = await prisma.user.update({
        where: { id: data.id },
        data: validatedData as any,
    })

    revalidatePath('/profile')

    return updatedUser
}