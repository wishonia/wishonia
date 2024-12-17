'use server'

import { triggerCall } from '@/lib/calls/retell'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getOrCreatePersonForUser } from '@/lib/models/person'

export async function savePhoneNumber(formData: FormData) {
  const session = await requireAuth('/phone-friend')
  const phone = formData.get('phone') as string

  // Save phone number to user profile
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { phoneNumber: phone }
  })

  // get or create a Person for the User
  const person = await getOrCreatePersonForUser(user)

  // Add the phone number to the person
  await prisma.person.update({
    where: { id: person.id },
    data: { phoneNumber: phone }
  })

  revalidatePath('/phone-friend')
}

export async function initiateCall() {
  console.log('Initiating call - starting process')
  const session = await requireAuth('/phone-friend')
  console.log('Got session:', { userId: session.user.id })
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // get or create a Person for the User
  const person = await getOrCreatePersonForUser(user)

  console.log('Found user:', {
    userId: user.id,
    hasPhoneNumber: !!person.phoneNumber
  })

  try {
    console.log('Calling Retell with config:', {
      fromNumber: process.env.RETELL_FROM_NUMBER,
      hasAgentId: !!process.env.RETELL_DEFAULT_AGENT_ID
    })

    const callResponse = await triggerCall(person, {
      fromNumber: process.env.RETELL_FROM_NUMBER || '',
      overrideAgentId: process.env.RETELL_DEFAULT_AGENT_ID,
      dropIfMachine: true,
    })

    console.log('Call initiated successfully:', callResponse)
    return { success: true, callId: callResponse.call_id }
  } catch (error) {
    console.error('Failed to initiate call:', error)
    // Log additional error details if available
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        // @ts-ignore
        statusCode: error.statusCode,
        // @ts-ignore
        response: error.response
      })
    }
    return { success: false, error: 'Failed to initiate call' }
  }
}