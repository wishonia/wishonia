"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { getDetailedRateLimit } from "../actions"

interface DetailedRateLimit {
  resources: {
    core: RateLimitResource
    search: RateLimitResource
    graphql: RateLimitResource
  }
}

interface RateLimitResource {
  limit: number
  used: number
  remaining: number
  reset: Date
}

function RateLimitSection({
  title,
  data,
}: {
  title: string
  data: RateLimitResource
}) {
  const percentage = (data.remaining / data.limit) * 100
  const isLow = percentage < 20
  const resetTime = new Date(data.reset).toLocaleTimeString()

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <div className="text-muted-foreground">{title}</div>
      </div>
      <div className={cn("font-medium", isLow && "text-red-500")}>
        {data.remaining}/{data.limit} remaining
      </div>
      <div className="text-sm text-muted-foreground">Used: {data.used}</div>
      <div className="relative w-full">
        <Progress
          value={percentage}
          className={cn("h-2", isLow && "[&>div]:bg-red-500")}
        />
      </div>
      <div className="text-xs text-muted-foreground">Resets at {resetTime}</div>
    </div>
  )
}

export default function RateLimitStatus() {
  const [rateLimit, setRateLimit] = useState<DetailedRateLimit | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchRateLimit = useCallback(async () => {
    try {
      const data = await getDetailedRateLimit()
      if (data) {
        setRateLimit(data)
        setError(null)
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch rate limit"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRateLimit()
    const interval = setInterval(fetchRateLimit, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [fetchRateLimit])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

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

  if (!isExpanded) {
    const corePercentage =
      (rateLimit.resources.core.remaining / rateLimit.resources.core.limit) *
      100
    const isLow = corePercentage < 20

    return (
      <Card
        className={cn(
          "w-full max-w-xs cursor-pointer",
          isLow && "border-red-500"
        )}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="pt-4">
          <RateLimitSection
            title="API Rate Limit"
            data={rateLimit.resources.core}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>GitHub API Rate Limits</CardTitle>
        <button
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setIsExpanded(false)}
        >
          Collapse
        </button>
      </CardHeader>
      <CardContent className="space-y-6">
        <RateLimitSection title="REST API" data={rateLimit.resources.core} />
        <RateLimitSection
          title="Search API"
          data={rateLimit.resources.search}
        />
        <RateLimitSection
          title="GraphQL API"
          data={rateLimit.resources.graphql}
        />
      </CardContent>
    </Card>
  )
}