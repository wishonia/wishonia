"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { getGithubRateLimit } from "../actions"

interface RateLimit {
  remaining: number
  limit: number
  reset: Date
  used: number
}

const CACHE_KEY = "github-rate-limit"
const CACHE_DURATION = 30000 // 30 seconds
const UPDATE_INTERVAL = 60000 // 1 minute

export default function RateLimitStatus() {
  const [rateLimit, setRateLimit] = useState<RateLimit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRateLimit = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRateLimit({
            ...data,
            reset: new Date(data.reset),
          })
          setLoading(false)
          return
        }
      }

      const data = await getGithubRateLimit()
      if (data) {
        // Update cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          })
        )
        setRateLimit(data)
        setError(null)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch rate limit"
      setError(message)
      console.error("Rate limit error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRateLimit()

    // Only set up interval if we successfully got initial data
    const interval = setInterval(() => {
      // Don't update if the user isn't viewing the page
      if (document.visibilityState === "visible") {
        fetchRateLimit()
      }
    }, UPDATE_INTERVAL)

    // Clean up interval
    return () => clearInterval(interval)
  }, [fetchRateLimit])

  // Add visibility change listener to update when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchRateLimit()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [fetchRateLimit])

  if (loading) return null

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-xs">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load rate limit</AlertDescription>
      </Alert>
    )
  }

  if (!rateLimit) return null

  const percentage = (rateLimit.remaining / rateLimit.limit) * 100
  const resetTime = new Date(rateLimit.reset).toLocaleTimeString()
  const isLow = percentage < 20

  return (
    <Card className={cn("w-full max-w-xs", isLow && "border-red-500")}>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="text-muted-foreground">GitHub API Rate Limit</div>
          </div>
          <div className={cn("font-medium", isLow && "text-red-500")}>
            {rateLimit.remaining}/{rateLimit.limit} remaining
          </div>
          <div className="relative w-full">
            <Progress
              value={percentage}
              className={cn("h-2", isLow && "[&>div]:bg-red-500")}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Resets at {resetTime}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
