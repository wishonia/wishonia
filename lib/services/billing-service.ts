import type { ApiEndpointPricing } from '@prisma/client'

import prisma from '@/lib/prisma'

type EndpointPricing = Pick<ApiEndpointPricing, 'id' | 'pricePerRequest' | 'endpoint' | 'method' | 'active'> | null

export async function getEndpointPricing(endpoint: string, method: string): Promise<EndpointPricing> {
  return await prisma.apiEndpointPricing.findFirst({
    where: {
      endpoint,
      method,
      active: true,
    },
    select: {
      id: true,
      pricePerRequest: true,
      endpoint: true,
      method: true,
      active: true
    }
  })
}

export async function trackEndpointUsage(
  subscriptionId: string,
  endpointPricingId: string,
  billedAmount: number
): Promise<void> {
  const period = new Date().toISOString().slice(0, 7) // YYYY-MM format

  await prisma.apiEndpointUsage.upsert({
    where: {
      endpointPricingId_subscriptionId_period: {
        endpointPricingId,
        subscriptionId,
        period,
      },
    },
    update: {
      requestCount: { increment: 1 },
      billableAmount: { increment: billedAmount },
    },
    create: {
      endpointPricingId,
      subscriptionId,
      period,
      requestCount: 1,
      billableAmount: billedAmount,
    },
  })
}

type CreateApiRequestInput = {
  apiKeyId: string
  endpoint: string
  method: string
  status: number
  duration: number
  endpointPricingId: string | null
  billedAmount: number | null
  error: string | null
  billable: boolean
}

export async function logApiRequest(
  apiKeyId: string,
  endpoint: string,
  method: string,
  status: number,
  duration: number,
  endpointPricingId?: string,
  billedAmount?: number,
  error?: string
): Promise<void> {
  const requestData: CreateApiRequestInput = {
    apiKeyId,
    endpoint,
    method,
    status,
    duration,
    endpointPricingId: endpointPricingId || null,
    billedAmount: billedAmount || null,
    error: error || null,
    billable: true
  }

  await prisma.apiRequest.create({
    data: requestData
  })
} 