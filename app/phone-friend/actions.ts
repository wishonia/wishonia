'use server'

import { triggerCall } from '@/lib/calls/retell'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { NotifyMethod } from '@prisma/client'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export async function initiateCall(personId: string) {
  const session = await requireAuth('/phone-friend')
  console.log('Initiating call - starting process')

  // Get the person
  const person = await prisma.person.findUnique({
    where: { id: personId }
  })

  if (!person) {
    throw new Error('Person not found')
  }

  if (!person.phoneNumber) {
    throw new Error('Person has no phone number')
  }

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
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
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

  // Check if a schedule already exists for this person and user
  const existingSchedule = await prisma.callSchedule.findFirst({
    where: {
      userId: session.user.id,
      personId: personId
    }
  })

  // Convert time to a human-readable format for the name
  const [hours, minutes] = time.split(':')
  const timeStr = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes))
    .toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    })

  const scheduleData = {
    name: `Daily Check-in at ${timeStr}`,
    cronExpression: time,
    enabled: true,
    agent: {
      connect: {
        id: agentId
      }
    }
  }

  let schedule;
  if (existingSchedule) {
    // Update existing schedule
    schedule = await prisma.callSchedule.update({
      where: { id: existingSchedule.id },
      data: scheduleData
    })
  } else {
    // Create new schedule
    schedule = await prisma.callSchedule.create({
      data: {
        ...scheduleData,
        person: {
          connect: {
            id: personId
          }
        },
        user: {
          connect: {
            id: session.user.id
          }
        }
      }
    })
  }

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
    // Just return the existing person
    return existingPersonByPhone
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
      // Update the existing person with new phone number
      const updatedPerson = await prisma.person.update({
        where: { id: existingPersonByEmail.id },
        data: {
          phoneNumber: data.phoneNumber,
          name: data.name // Update name in case it changed
        }
      })

      revalidatePath('/phone-friend/schedules')
      return updatedPerson
    }
  }

  // Create new person if no existing record found
  const person = await prisma.person.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email?.trim() || null
    }
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

  revalidatePath('/phone-friend/schedules')
  return updatedSchedule
}

export async function createStripeCheckoutSession() {
  const session = await requireAuth('/phone-friend')

  // Get or create Stripe customer
  let customer = await prisma.stripeCustomer.findUnique({
    where: { userId: session.user.id },
  })

  if (!customer) {
    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email!,
      metadata: {
        userId: session.user.id,
      },
    })

    // Save Stripe customer in our DB
    customer = await prisma.stripeCustomer.create({
      data: {
        id: stripeCustomer.id,
        userId: session.user.id,
      },
    })
  }

  // Create Stripe checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID, // Your price ID from Stripe
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/phone-friend/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/phone-friend/account?canceled=true`,
  })

  if (!stripeSession.url) {
    throw new Error('Failed to create checkout session')
  }

  redirect(stripeSession.url)
}

export async function createStripePortalSession() {
  const session = await requireAuth('/phone-friend')

  const customer = await prisma.stripeCustomer.findUnique({
    where: { userId: session.user.id },
  })

  if (!customer) {
    throw new Error('No customer found')
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/phone-friend/account`,
  })

  redirect(portalSession.url)
}