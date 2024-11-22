import { useEffect, useState } from "react"

import type { DetailedRateLimit } from "@/app/docs/[org]/[repo]/actions"
import { getDetailedRateLimit } from "@/app/docs/[org]/[repo]/actions"

const RATE_LIMIT_REFRESH_INTERVAL = 60000 // 1 minute

export function useDetailedRateLimit() {
  const [data, setData] = useState<DetailedRateLimit | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let intervalId: NodeJS.Timeout

    const fetchRateLimit = async () => {
      try {
        const rateLimit = await getDetailedRateLimit()
        if (mounted) {
          setData(rateLimit)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch rate limit")
          )
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchRateLimit()
    intervalId = setInterval(fetchRateLimit, RATE_LIMIT_REFRESH_INTERVAL)

    return () => {
      mounted = false
      clearInterval(intervalId)
    }
  }, [])

  return { data, error, isLoading }
}
