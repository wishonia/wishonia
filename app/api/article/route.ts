import { NextRequest, NextResponse } from 'next/server'
import { MarkdownEnhancer } from '@/lib/content/markdownEnhancer'
import { validateApiKey, validateSubscription } from '@/lib/services/auth-service'
import type { ApiKeyWithRelations } from '@/lib/services/auth-service'
import { CacheService } from '@/lib/services/cache-service'
import { getEndpointPricing, trackEndpointUsage, logApiRequest } from '@/lib/services/billing-service'
import { withRateLimit } from '@/middleware/rateLimiter'


async function handleRequest(request: NextRequest) {
    
// Validate and type the API key
const TAVILY_API_KEY = process.env.TAVILY_API_KEY as string
if (!TAVILY_API_KEY) {
  throw new Error('TAVILY_API_KEY environment variable is not set')
}
  const startTime = Date.now()
  const cacheService = CacheService.getInstance()
  let keyData: ApiKeyWithRelations | null = null
  
  try {
    const apiKey = request.headers.get('x-api-key')
    keyData = await validateApiKey(apiKey)
    
    if (!keyData) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const activeSubscription = await validateSubscription(keyData)
    const endpointPricing = await getEndpointPricing('/api/article', 'POST')
    
    if (!endpointPricing) {
      return NextResponse.json(
        { error: 'Endpoint pricing not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { content, title } = body

    if (!content || typeof content !== 'string' || !title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Content and title are required and must be strings' },
        { status: 400 }
      )
    }

    // Check cache
    const cacheKey = `article:${Buffer.from(title + content).toString('base64')}`
    const cachedResult = await cacheService.get<any>(cacheKey)
    
    if (cachedResult) {
      await logApiRequest(
        keyData.id,
        '/api/article',
        'POST',
        200,
        Date.now() - startTime,
        endpointPricing.id,
        endpointPricing.pricePerRequest
      )
      return NextResponse.json(cachedResult)
    }

    // Process content
    const enhancer = new MarkdownEnhancer(TAVILY_API_KEY)
    const result = await enhancer.enhance(content, title)

    // Cache result
    await cacheService.set(cacheKey, result)

    // Track usage and billing
    await trackEndpointUsage(
      activeSubscription.id,
      endpointPricing.id,
      endpointPricing.pricePerRequest
    )

    await logApiRequest(
      keyData.id,
      '/api/article',
      'POST',
      200,
      Date.now() - startTime,
      endpointPricing.id,
      endpointPricing.pricePerRequest
    )

    return NextResponse.json(result)
    
  } catch (error) {
    const status = error instanceof Error && error.message.includes('Rate limit') ? 429 : 500
    
    if (keyData?.id) {
      await logApiRequest(
        keyData.id,
        '/api/article',
        'POST',
        status,
        Date.now() - startTime,
        undefined,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status }
    )
  }
}

export async function POST(request: NextRequest) {
  // Get rate limit from API key
  const apiKey = request.headers.get('x-api-key')
  const keyData = await validateApiKey(apiKey)
  
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  return withRateLimit(
    request,
    handleRequest,
    { perMinute: keyData.requestPerMinute ?? 60 }
  )
}

export const runtime = 'nodejs'
export const maxDuration = 60 // in seconds
export const dynamic = 'force-dynamic' 