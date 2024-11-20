import { logger } from "@/lib/logger"
import {
  sendDailySummaries,
  sendWeeklySummaries,
} from "@/lib/notifications/petition-notifications"

const log = logger.forService("cron-petition-summaries")

export async function GET() {
  try {
    log.info("Starting petition summary notifications")

    await Promise.all([sendDailySummaries(), sendWeeklySummaries()])

    log.info("Completed petition summary notifications")

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

    return new Response("Internal Server Error", { status: 500 })
  }
}
