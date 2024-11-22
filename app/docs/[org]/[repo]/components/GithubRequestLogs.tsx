"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getGithubRequestLogs } from "../actions"

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

  const fetchLogs = async () => {
    const newLogs = await getGithubRequestLogs()
    setLogs(newLogs)
  }

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
      const interval = setInterval(fetchLogs, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>GitHub API Requests</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
