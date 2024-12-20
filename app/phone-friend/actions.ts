'use server'

import { triggerCall } from '@/lib/calls/retell'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getOrCreatePersonForUser } from '@/lib/models/person'
import { NotifyMethod } from '@prisma/client'
import { getServerSession } from "next-auth"

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

export async function createCallSchedule(formData: FormData) {
  const session = await requireAuth('/phone-friend')
  
  const time = formData.get('time') as string
  const personId = formData.get('personId') as string
  const agentId = formData.get('agentId') as string

  // Convert time to a human-readable format for the name
  const [hours, minutes] = time.split(':')
  const timeStr = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes))
    .toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    })

  const schedule = await prisma.callSchedule.create({
    data: {
      name: `Daily Check-in at ${timeStr}`,
      cronExpression: time,
      enabled: true,
      person: {
        connect: {
          id: personId
        }
      },
      agent: {
        connect: {
          id: agentId
        }
      },
      user: {
        connect: {
          id: session.user.id
        }
      }
    }
  })

  revalidatePath('/phone-friend/recipients')
  revalidatePath('/phone-friend/schedules')
  return schedule
}

export async function addCallSummaryRecipient(
  scheduledCallId: string,
  data: {
    personId: string
    notifyBy: NotifyMethod[]
  }
) {
  const session = await requireAuth('/phone-friend')

  const recipient = await prisma.callSummaryRecipient.create({
    data: {
      personId: data.personId,
      scheduledCallId,
      notifyBy: data.notifyBy
    }
  })

  revalidatePath('/phone-friend/schedules')
  return recipient
}

export async function removeCallSummaryRecipient(id: string) {
  const session = await requireAuth('/phone-friend')

  await prisma.callSummaryRecipient.delete({
    where: { id }
  })

  revalidatePath('/phone-friend/schedules')
}

export async function createPerson(data: {
  name: string
  email?: string
  phoneNumber: string
}) {
  const session = await requireAuth('/phone-friend')

  // Debug logging
  console.log('Creating person with data:', data)

  // Validate required fields
  if (!data.name || !data.phoneNumber) {
    throw new Error('Name and phone number are required')
  }

  // Check if phone number is already in use
  const existingPersonByPhone = await prisma.person.findUnique({
    where: { phoneNumber: data.phoneNumber }
  })

  if (existingPersonByPhone) {
    // Update the existing person and connect to current user
    const updatedPerson = await prisma.person.update({
      where: { id: existingPersonByPhone.id },
      data: {
        name: data.name, // Update name in case it changed
        email: data.email?.trim() || existingPersonByPhone.email, // Keep existing email if none provided
        }
      }
    })

    revalidatePath('/phone-friend/recipients')
    return updatedPerson
  }

  // Check if person exists with this email
  if (data.email && data.email.trim() !== '') {
    const existingPersonByEmail = await prisma.person.findFirst({
      where: {
        email: {
          equals: data.email,
          mode: 'insensitive'
        }
      }
    })

    if (existingPersonByEmail) {
      // Update the existing person with new phone number and connect to user
      const updatedPerson = await prisma.person.update({
        where: { id: existingPersonByEmail.id },
        data: {
          phoneNumber: data.phoneNumber,
          name: data.name, // Update name in case it changed
          user: {
            connect: {
              id: session.user.id
            }
          }
        }
      })

      revalidatePath('/phone-friend/recipients')
      return updatedPerson
    }
  }

  // Create new person if no existing record found
  const createData = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    email: data.email?.trim() || null,
    user: {
      connect: {
        id: session.user.id
      }
    }
  }

  // Debug logging
  console.log('Creating person with processed data:', createData)

  const person = await prisma.person.create({
    data: createData
  })

  revalidatePath('/phone-friend/recipients')
  return person
}

export async function deleteSchedule(scheduleId: string) {
  const session = await requireAuth('/phone-friend')

  const schedule = await prisma.callSchedule.findUnique({
    where: { id: scheduleId },
    select: { userId: true }
  })

  if (!schedule || schedule.userId !== session.user.id) {
    throw new Error('Not authorized to delete this schedule')
  }

  await prisma.callSchedule.delete({
    where: { id: scheduleId }
  })

  revalidatePath('/phone-friend/recipients')
  revalidatePath('/phone-friend/schedules')
}

export async function updateSchedule(scheduleId: string, data: {
  name: string
  time: string
  agentId: string
  enabled: boolean
}) {
  const session = await requireAuth('/phone-friend')

  const schedule = await prisma.callSchedule.findUnique({
    where: { id: scheduleId },
    select: { userId: true }
  })

  if (!schedule || schedule.userId !== session.user.id) {
    throw new Error('Not authorized to update this schedule')
  }

  const updatedSchedule = await prisma.callSchedule.update({
    where: { id: scheduleId },
    data: {
      name: data.name,
      cronExpression: data.time, // You might want to convert time to cron expression
      agentId: data.agentId,
      enabled: data.enabled
    }
  })

  revalidatePath('/phone-friend/recipients')
  revalidatePath('/phone-friend/schedules')
  return updatedSchedule
}