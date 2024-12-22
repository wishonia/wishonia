import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { env } from "@/env.mjs"

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
}) : null

export async function POST(req: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET || !stripe) {
    return new NextResponse('Stripe is not configured', { status: 500 })
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
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