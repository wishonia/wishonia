"use client"

import { useEffect, useState } from "react"
import { Loader2, RefreshCw, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { clearGithubRequestLogs, getGithubRequestLogs } from "../actions"

interface GithubRequestLog {
  endpoint: string
  timestamp: Date
  rateLimit?: {
    remaining: number
    limit: number
  }
}

export default function GithubRequestLogs() {
  const [logs, setLogs] = useState<GithubRequestLog[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLogs = async () => {
    try {
      setIsRefreshing(true)
      const newLogs = await getGithubRequestLogs()
      setLogs(newLogs)
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const clearLogs = async () => {
    try {
      setIsClearing(true)
      await clearGithubRequestLogs()
      setLogs([])
    } catch (error) {
      console.error("Failed to clear logs:", error)
    } finally {
      setIsClearing(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4"
      >
        Show API Logs
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 max-h-[80vh] w-96 overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>GitHub API Requests</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchLogs}
            disabled={isRefreshing}
            className="h-8 px-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            disabled={isClearing || logs.length === 0}
            className="h-8 px-2"
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8"
          >
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No logs to display
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div key={i} className="border-b pb-2 text-sm">
                <div className="font-medium">{log.endpoint}</div>
                <div className="text-muted-foreground">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                {log.rateLimit && (
                  <div className="text-muted-foreground">
                    Rate Limit: {log.rateLimit.remaining}/{log.rateLimit.limit}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
