import prisma from '@/lib/prisma'
import type { ApiKey, Subscription } from '@prisma/client'

export type ApiKeyWithRelations = ApiKey & {
  requestPerMinute?: number
  user: {
    id: string
    StripeCustomer: {
      id: string
      subscriptions: Array<Pick<Subscription, 'id' | 'status' | 'currentPeriodEnd'>>
    } | null
  }
}

export async function validateApiKey(apiKey: string | null): Promise<ApiKeyWithRelations | null> {
  if (!apiKey) return null

  return await prisma.apiKey.findFirst({
    where: {
      displayApiKey: apiKey,
    },
    include: {
      user: {
        select: {
          id: true,
          StripeCustomer: {
            select: {
              id: true,
              subscriptions: {
                where: {
                  status: 'ACTIVE',
                },
                select: {
                  id: true,
                  status: true,
                  currentPeriodEnd: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  }) as ApiKeyWithRelations | null
}

export type ValidSubscription = Pick<Subscription, 'id' | 'status' | 'currentPeriodEnd'>

export async function validateSubscription(keyData: ApiKeyWithRelations | null): Promise<ValidSubscription> {
  const activeSubscription = keyData?.user?.StripeCustomer?.subscriptions[0]
  if (!activeSubscription) {
    throw new Error('No active subscription found')
  }
  return activeSubscription
} 