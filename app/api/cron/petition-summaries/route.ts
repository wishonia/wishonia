import { NextRequest } from "next/server"

import { logger } from "@/lib/logger"
import {
  sendDailySummaries,
  sendWeeklySummaries,
} from "@/lib/notifications/petition-notifications"

const log = logger.forService("cron-petition-summaries")

export async function GET(request: NextRequest) {
  const cronSecret = request.headers.get("x-cron-secret")
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const type = request.nextUrl.searchParams.get("type")
  if (!type || !["daily", "weekly"].includes(type)) {
    return new Response("Invalid type parameter", { status: 400 })
  }

  try {
    log.info(`Starting ${type} petition summary notifications`)

    if (type === "daily") {
      await sendDailySummaries()
    } else {
      await sendWeeklySummaries()
    }

    log.info(`Completed ${type} petition summary notifications`)

    return new Response("OK", { status: 200 })
  } catch (error) {
    log.error("Failed to send petition summaries", {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : { message: String(error) },
    })

    // Return a more specific error response
    return new Response(
      JSON.stringify({ error: "Failed to process petition summaries" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
