import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { processScheduledCalls } from '@/lib/calls/retell'

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    const results = await processScheduledCalls()

    return NextResponse.json({
      message: 'Scheduled calls processed',
      results
    })

  } catch (error) {
    logger.error('Error in scheduled calls cron', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
} 