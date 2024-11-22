import { getRedisClient } from "@/lib/utils/redis"





const CACHE_TTL = 5 * 60 // 5 minutes in seconds

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const redis = getRedisClient()

  try {
    // Try to get from cache first
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    // If not in cache, fetch and store
    const data = await fetchFn()
    await redis.setex(key, ttl, JSON.stringify(data))
    return data
  } catch (error) {
    console.error("Cache error:", error)
    // If cache fails, just fetch the data
    return fetchFn()
  }
}
