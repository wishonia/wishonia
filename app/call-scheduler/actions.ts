'use server'

import { initiateScheduledCall } from '@/lib/calls/retell'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { NotifyMethod } from '@prisma/client'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'
import { Session } from 'next-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

export async function initiateCall(session: Session, personId: string) {
  console.log('Initiating call - starting process')

  const result = await initiateScheduledCall(session.user.id, personId)

  if (!result.success) {
    console.error('Failed to initiate call:', result.error)
  } else {
    console.log('Call initiated successfully:', result)
  }

  return result
}

export async function createCallSchedule(session: Session, formData: FormData) {
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

  revalidatePath('/call-scheduler/schedules')
  return schedule
}

export async function addCallSummaryRecipient(
  session: Session,
  scheduledCallId: string,
  data: {
    personId: string
    notifyBy: NotifyMethod[]
  }
) {
  const recipient = await prisma.callSummaryRecipient.create({
    data: {
      personId: data.personId,
      scheduledCallId,
      notifyBy: data.notifyBy
    }
  })

  revalidatePath('/call-scheduler/schedules')
  return recipient
}

export async function removeCallSummaryRecipient(session: Session, id: string) {
  await prisma.callSummaryRecipient.delete({
    where: { id }
  })

  revalidatePath('/call-scheduler/schedules')
}

export async function createPerson(session: Session, data: {
  name: string
  email?: string
  phoneNumber: string
}) {
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

      revalidatePath('/call-scheduler/schedules')
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

  revalidatePath('/call-scheduler/recipients')
  return person
}

export async function deleteSchedule(session: Session, scheduleId: string) {
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

  revalidatePath('/call-scheduler/schedules')
}

export async function updateSchedule(session: Session, scheduleId: string, data: {
  name: string
  time: string
  agentId: string
  enabled: boolean
}) {
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

  revalidatePath('/call-scheduler/schedules')
  return updatedSchedule
}

export async function createStripeCheckoutSession(session: Session) {
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
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/call-scheduler/account?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/call-scheduler/account?canceled=true`,
  })

  if (!stripeSession.url) {
    throw new Error('Failed to create checkout session')
  }

  redirect(stripeSession.url)
}

export async function createStripePortalSession(session: Session) {
  const customer = await prisma.stripeCustomer.findUnique({
    where: { userId: session.user.id },
  })

  if (!customer) {
    throw new Error('No customer found')
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/call-scheduler/account`,
  })

  redirect(portalSession.url)
}

export async function updatePerson(session: Session, personId: string, data: {
  name: string
  phoneNumber: string
  email?: string
  timeZone?: string
  notes?: string
}) {
  const person = await prisma.person.update({
    where: { id: personId },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email || null,
      timeZone: data.timeZone || null,
      updatedAt: new Date(),
    }
  })

  revalidatePath('/call-scheduler/schedules')
  return person
}