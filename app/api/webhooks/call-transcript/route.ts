import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emailer } from '@/lib/email/emailer'
import { wrapEmailContent } from '@/lib/emails/template'

interface CallTranscript {
  event: string
  call: {
    call_type: string
    from_number: string
    to_number: string
    direction: string
    call_id: string
    agent_id: string
    call_status: string
    metadata: Record<string, any>
    retell_llm_dynamic_variables: {
      customer_name: string
    }
    start_timestamp: number
    end_timestamp: number
    disconnection_reason: string
    transcript: string
    transcript_object: any[]
    transcript_with_tool_calls: any[]
    opt_out_sensitive_data_storage: boolean
  }
}

function getCallSummaryEmail(params: {
  transcript: string
  callerName: string
  callDate: Date
  baseUrl: string
  userId: string
}) {
  const content = `
    <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; margin-bottom: 24px;">Call Summary</h1>
      
      <p>Here's a summary of the call with <strong>${params.callerName}</strong> on ${params.callDate.toLocaleString()}:</p>
      
      <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #2563eb;">
        <pre style="white-space: pre-wrap; font-family: inherit;">${params.transcript}</pre>
      </div>
    </div>
  `

  return wrapEmailContent({ content, userId: params.userId, baseUrl: params.baseUrl })
}

export async function POST(request: Request) {
  try {
    const data: CallTranscript = await request.json()

    // Only process call_ended events
    if (data.event !== 'call_ended') {
      return NextResponse.json({ message: 'Event type not supported' }, { status: 400 })
    }

    // Find person by phone number
    const person = await prisma.person.findUnique({
      where: {
        phoneNumber: data.call.from_number
      },
      include: {
        callSummaryRecipients: {
          include: {
            person: true
          }
        }
      }
    })

    if (!person) {
      return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Get or create associated user
    let user = person.userId ? await prisma.user.findUnique({
      where: { id: person.userId }
    }) : null

    if (!user) {
      // Create new user if one doesn't exist
      user = await prisma.user.create({
        data: {
          phoneNumber: person.phoneNumber,
          firstName: person.firstName,
          lastName: person.lastName,
          name: person.name,
          email: person.email,
          // Link back to person
          person: {
            connect: {
              id: person.id
            }
          }
        }
      })

      // Update person with user ID
      await prisma.person.update({
        where: { id: person.id },
        data: { userId: user.id }
      })
    }

    // Send email summaries to recipients
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!
    const callDate = new Date(data.call.end_timestamp)
    const callerName = person.name || 'Unknown Caller'

    for (const recipient of person.callSummaryRecipients) {
      if (recipient.person.email && recipient.notifyBy.includes('EMAIL')) {
        await emailer.send({
          to: recipient.person.email,
          subject: `Call Summary: ${callerName} - ${callDate.toLocaleDateString()}`,
          html: getCallSummaryEmail({
            transcript: data.call.transcript,
            callerName,
            callDate,
            baseUrl,
            userId: recipient.person.id,
          })
        })
      }
    }

    return NextResponse.json({ message: 'Call transcript processed successfully' })

  } catch (error) {
    console.error('Error processing call transcript:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
} 