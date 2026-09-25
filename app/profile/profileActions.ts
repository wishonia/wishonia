'use server'
import prisma from "@/lib/prisma"
import { requireUserId } from "@/lib/api/getUserIdServer"
import { userSchema } from "./userSchema"
import { revalidatePath } from "next/cache"

// Moderation and account-status fields are never self-service. The email
// comes from the sign-in provider: sign-in and organization claims trust it.
const selfServiceUserSchema = userSchema.omit({
    badges: true,
    banned: true,
    type: true,
    verified: true,
    email: true,
})

export async function updateUser(data: unknown) {
    // Always update the signed-in user, never an id sent by the client.
    const userId = await requireUserId()
    const validatedData = selfServiceUserSchema.parse(data);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: validatedData as any,
    })

    revalidatePath('/profile')

    return updatedUser
}
