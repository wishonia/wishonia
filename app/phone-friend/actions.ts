'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { revalidatePath } from 'next/cache'

export async function savePhoneNumber(formData: FormData) {
  const session = await getServerSession()
  const phone = formData.get('phone') as string

  if (!phone) {
    throw new Error('Phone number is required')
  }

  if (!session?.user?.id) {
    throw new Error('User must be logged in')
  }

  try {
    // Update the user's phone number directly
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        phoneNumber: phone,
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to save phone number' }
  }
}