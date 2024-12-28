import { parse } from "url"

import { Redis } from "ioredis"

const redisDefaultPort = 6379
const sentinelDefaultPort = 26379

export interface IRedisUrl {
  database?: string
  host: string
  password?: string
  port: number
}

// Interface for our cache implementation
export interface Cache {
  lookup(key: string): Promise<string | null>
  update(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

const predefinedSeparatorRegexp = /,|;|\s/

function preparePassword(auth: string | null, encoding?: BufferEncoding) {
  if (!auth) {
    return undefined
  }

  const vv = (encoding ? Buffer.from(auth, encoding).toString() : auth).split(":")
  return vv.length > 1 ? vv[1] : vv[0]
}

function prepareResult(
  v: string,
  sentinel: boolean,
  encoding?: BufferEncoding
): IRedisUrl {
  if (v.search("://") === -1) {
    v = "redis://" + v
  }
  const urlWithStringQuery = parse(v)

  return {
    database: sentinel
      ? undefined
      : (urlWithStringQuery.pathname || "/0").substr(1) || "0",
    host: urlWithStringQuery.hostname || "localhost",
    password: sentinel
      ? undefined
      : preparePassword(urlWithStringQuery.auth, encoding),
    port: Number(
      urlWithStringQuery.port ||
        (sentinel ? sentinelDefaultPort : redisDefaultPort)
    ),
  }
}

export function parseRedisUrl(
  value?: string,
  sentinel: boolean = false,
  separatorRegexp: RegExp = predefinedSeparatorRegexp,
  encoding?: BufferEncoding
): IRedisUrl | undefined {
  if (!value) {
    return {
      database: sentinel ? undefined : "0",
      host: "localhost",
      port: sentinel ? sentinelDefaultPort : redisDefaultPort,
    }
  }

  const result = new Array<IRedisUrl>()
  const urlValues = value
    .split(separatorRegexp)
    .map((value1) => value1.trim())
    .filter((value1) => value1 && value1.length)

  for (const urlValue of urlValues) {
    const parsedResult = prepareResult(urlValue, sentinel, encoding)
    result.push(parsedResult)
  }

  return result.length > 0 ? result[0] : undefined
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
