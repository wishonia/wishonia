import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { text2measurements } from '@/lib/text2measurements'

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

    // Process transcript with text2measurements
    const measurements = await text2measurements(
      data.call.transcript,
      new Date(data.call.end_timestamp).toISOString(),
      0 // Default to UTC if no timezone info available
    )

    return NextResponse.json({ 
      message: 'Measurements processed successfully',
      measurements
    })

  } catch (error) {
    console.error('Error processing call transcript:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
} 