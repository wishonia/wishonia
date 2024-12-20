import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Subscription

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await prisma.subscription.upsert({
          where: {
            id: session.id,
          },
          create: {
            id: session.id,
            status: session.status,
            stripeCustomerId: session.customer as string,
            currentPeriodEnd: new Date(session.current_period_end * 1000),
          },
          update: {
            status: session.status,
            currentPeriodEnd: new Date(session.current_period_end * 1000),
          },
        })
        break

      case 'customer.subscription.deleted':
        await prisma.subscription.update({
          where: {
            id: session.id,
          },
          data: {
            status: 'canceled',
          },
        })
        break
    }
  } catch (error) {
    console.error('Error processing Stripe webhook:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }

  return new NextResponse(null, { status: 200 })
} 