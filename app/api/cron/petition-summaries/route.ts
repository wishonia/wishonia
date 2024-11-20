import { NextResponse } from 'next/server'
import { sendDailySummaries, sendWeeklySummaries } from '@/lib/notifications/petition-summary'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'daily') {
      await sendDailySummaries()
    } else if (type === 'weekly') {
      await sendWeeklySummaries()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json({ error: 'Failed to process summaries' }, { status: 500 })
  }
} 