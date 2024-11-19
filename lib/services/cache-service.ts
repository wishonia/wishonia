import { Redis } from '@upstash/redis'
import { createClient, RedisClientType } from 'redis'

export class CacheService {
  private static instance: CacheService
  private redisClient: Redis | RedisClientType | null = null
  private readonly CACHE_TTL = 3600

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  private async initializeRedisClient() {
    if (this.redisClient) return this.redisClient

    const useLocalRedis = process.env.USE_LOCAL_REDIS === 'true'

    if (useLocalRedis) {
      const localRedisUrl = process.env.LOCAL_REDIS_URL || 'redis://localhost:6379'
      this.redisClient = createClient({ url: localRedisUrl }) as RedisClientType
      await this.redisClient.connect()
    } else {
      const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL
      const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN

      if (upstashRedisRestUrl && upstashRedisRestToken) {
        this.redisClient = new Redis({
          url: upstashRedisRestUrl,
          token: upstashRedisRestToken
        })
      }
    }

    return this.redisClient
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.initializeRedisClient()
      if (!client) return null

      const data = await (client instanceof Redis 
        ? client.get(key)
        : client.get(key)) as string | null
      
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Redis cache error:', error)
      return null
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const client = await this.initializeRedisClient()
      if (!client) return

      const serializedValue = JSON.stringify(value)
      if (client instanceof Redis) {
        await client.set(key, serializedValue, { ex: this.CACHE_TTL })
      } else {
        await client.set(key, serializedValue, { EX: this.CACHE_TTL })
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }

  async cleanup(): Promise<void> {
    try {
      const client = await this.initializeRedisClient()
      if (!client) return

      const keys = await client.keys('article:*')
      for (const key of keys) {
        const ttl = await client.ttl(key)
        if (ttl <= 0) {
          await client.del(key)
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error)
    }
  }
} 