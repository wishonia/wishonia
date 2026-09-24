import { Redis } from "ioredis"

// Interface for our cache implementation
export interface Cache {
  lookup(key: string): Promise<string | null>
  update(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

export function getRedisClient() {
  return new Redis(process.env.REDIS_URL || "redis://localhost:6379")
}

// Our own Redis cache implementation to replace Langchain's
export class RedisCache implements Cache {
  private client: Redis
  private ttl?: number

  constructor(client: Redis, ttl?: number) {
    this.client = client
    this.ttl = ttl
  }

  async lookup(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async update(key: string, value: string): Promise<void> {
    if (this.ttl) {
      await this.client.setex(key, this.ttl, value)
    } else {
      await this.client.set(key, value)
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key)
  }
}

export function getRedisModelCache(ttl?: number): Cache {
  const client = getRedisClient()
  return new RedisCache(client, ttl)
}
