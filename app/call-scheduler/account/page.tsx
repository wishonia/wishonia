import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

import { createStripeCheckoutSession, createStripePortalSession } from "../actions"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/call-scheduler/account`) 
  }

  const handleSubscribe = async () => {
    await createStripeCheckoutSession(session)
  }

  const handleManageSubscription = async () => {
    await createStripePortalSession(session)
  }

  // Get subscription status
  const customer = await prisma.stripeCustomer.findUnique({
    where: { userId: session.user.id },
    include: {
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  const hasActiveSubscription = customer?.subscriptions[0]?.status === 'active'

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <div className="space-y-8">
        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Please Feed Our Robots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Status: {hasActiveSubscription ? (
                <span className="text-green-600 font-medium">Active</span>
              ) : (
                <span className="text-yellow-600 font-medium">Free Trial</span>
              )}
            </p>
            
            <div className="prose prose-sm text-muted-foreground">
              <p className="mb-3">
                Our friendly AI companions eat a lot of electricity and turn electrons into heartwarming conversations and 
                meaningful connections.
              </p>
              <p>
                These hungry little robots need a constant supply of computational power to keep 
                spreading joy. Your subscription helps keep them well-fed with the electrons they 
                crave, while ensuring the service remains accessible to everyone who needs a friend.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <form action={hasActiveSubscription ? handleManageSubscription : handleSubscribe}>
              <Button type="submit">
                {hasActiveSubscription ? 'Manage Subscription' : 'Support HeartLine'}
              </Button>
            </form>
          </CardFooter>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Name:</span>{' '}
                {session.user.name}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{' '}
                {session.user.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 