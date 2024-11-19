import { Redis } from '@upstash/redis'
import { createClient, RedisClientType } from 'redis'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let redisClient: Redis | RedisClientType | null = null

async function initializeRedisClient() {
  if (redisClient) return redisClient

  const useLocalRedis = process.env.USE_LOCAL_REDIS === 'true'

  if (useLocalRedis) {
    const localRedisUrl = process.env.LOCAL_REDIS_URL || 'redis://localhost:6379'
    redisClient = createClient({ url: localRedisUrl }) as RedisClientType
    await redisClient.connect()
  } else {
    const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN

    if (upstashRedisRestUrl && upstashRedisRestToken) {
      redisClient = new Redis({
        url: upstashRedisRestUrl,
        token: upstashRedisRestToken
      })
    }
  }

  return redisClient
}

export async function checkRateLimits(apiKey: string, limits: { perMinute: number }) {
  const client = await initializeRedisClient()
  if (!client) throw new Error('Redis client not initialized')

  const now = Date.now()
  const windowKey = `ratelimit:${apiKey}:${Math.floor(now / 60000)}` // Key for current minute

  let currentCount: number
  
  if (client instanceof Redis) {
    currentCount = await client.incr(windowKey)
    await client.expire(windowKey, 60)
  } else {
    const multi = client.multi()
    const results = await multi
      .incr(windowKey)
      .expire(windowKey, 60)
      .exec()
    currentCount = (results?.[0] as number) || 0
  }

  if (currentCount > limits.perMinute) {
    throw new Error(`Rate limit exceeded: ${limits.perMinute} requests per minute`)
  }

  return currentCount
}

export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  limits: { perMinute: number }
) {
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
  }

  try {
    await checkRateLimits(apiKey, limits)
    return await handler(request)
  } catch (error) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
} 