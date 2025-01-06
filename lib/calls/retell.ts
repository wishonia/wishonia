import { Person, CallStatus } from '@prisma/client'
import Retell from 'retell-sdk';
import type { CallResponse } from 'retell-sdk/resources/call';
import prisma from '@/lib/prisma'
import cron from 'cron-parser'

function getRetellClient(apiKey?: string) {
  const key = apiKey || process.env.RETELL_API_KEY
  if (!key) {
    throw new RetellError('RETELL_API_KEY environment variable is not set')
  }
  return new Retell({ apiKey: key })
}

interface RetellCallOptions {
  fromNumber: string
  overrideAgentId?: string
  metadata?: Record<string, any>
  dynamicVariables?: Record<string, any>
  dropIfMachine?: boolean
  retellApiKey?: string
}

type RetellCallResponse = CallResponse

export class RetellError extends Error {
  constructor(
      message: string,
      public statusCode?: number,
      public response?: any
  ) {
    super(message)
    this.name = 'RetellError'
  }
}

interface InitiateCallResult {
  success: boolean
  callId?: string
  error?: string
  agentId?: string
}

interface ProcessScheduledCallsResult {
  scheduleId: string
  callId?: string
  status: CallStatus
  error?: string
}

export async function processScheduledCalls(): Promise<ProcessScheduledCallsResult[]> {
  const now = new Date()
  const results: ProcessScheduledCallsResult[] = []

  // Get all active schedules with agent details
  const activeSchedules = await prisma.callSchedule.findMany({
    where: {
      enabled: true,
      OR: [
        { endDate: null },
        { endDate: { gt: now } }
      ]
    },
    include: {
      person: true,
      agent: {
        select: {
          id: true,
          metadata: true
        }
      }
    }
  })

  for (const schedule of activeSchedules) {
    try {
      // Parse cron expression
      const interval = cron.parseExpression(schedule.cronExpression)
      const nextRun = interval.next().toDate()
      const prevRun = interval.prev().toDate()

      // Check if we should run now (within last 5 minutes)
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000)
      if (nextRun > now || prevRun < fiveMinutesAgo) {
        continue
      }

      // Check if we already made a call for this schedule in this time window
      const recentCall = await prisma.scheduledCall.findFirst({
        where: {
          scheduleId: schedule.id,
          scheduledFor: {
            gte: fiveMinutesAgo,
            lte: now
          }
        }
      })

      if (recentCall) {
        continue
      }

      // Create scheduled call record
      const scheduledCall = await prisma.scheduledCall.create({
        data: {
          scheduleId: schedule.id,
          scheduledFor: now,
          status: CallStatus.SCHEDULED
        }
      })

      // Get agent credentials
      const agentMetadata = schedule.agent.metadata as {
        retellFromNumber?: string
        retellAgentId?: string
        retellApiKey?: string
      } || {}

      // Initiate call via Retell
      try {
        const response = await triggerCall(schedule.person, {
          fromNumber: agentMetadata.retellFromNumber || process.env.RETELL_FROM_NUMBER || '',
          overrideAgentId: agentMetadata.retellAgentId || process.env.RETELL_DEFAULT_AGENT_ID,
          retellApiKey: agentMetadata.retellApiKey,
          metadata: {
            scheduleId: schedule.id,
            scheduledCallId: scheduledCall.id,
            personId: schedule.person.id,
            agentId: schedule.agent.id
          }
        })

        // Update scheduled call with Retell ID
        await prisma.scheduledCall.update({
          where: { id: scheduledCall.id },
          data: {
            retellCallId: response.call_id,
            status: CallStatus.IN_PROGRESS
          }
        })

        results.push({
          scheduleId: schedule.id,
          callId: response.call_id,
          status: CallStatus.IN_PROGRESS
        })
      } catch (error) {
        // Update call record with error
        await prisma.scheduledCall.update({
          where: { id: scheduledCall.id },
          data: {
            status: CallStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        })

        results.push({
          scheduleId: schedule.id,
          status: CallStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        })
      }
    } catch (error) {
      results.push({
        scheduleId: schedule.id,
        status: CallStatus.FAILED,
        error: error instanceof Error ? error.message : 'Error processing schedule'
      })
    }
  }

  return results
}

export async function initiateScheduledCall(userId: string, personId: string): Promise<InitiateCallResult> {
  // Get the person with default agent
  const person = await prisma.person.findUnique({
    where: { id: personId },
    include: {
      callSchedules: {
        where: { userId },
        include: {
          agent: {
            select: {
              id: true,
              metadata: true
            }
          }
        },
        take: 1
      }
    }
  })

  if (!person) {
    throw new RetellError('Person not found')
  }

  if (!person.phoneNumber) {
    throw new RetellError('Person has no phone number')
  }

  // Get agent credentials from the first schedule or use defaults
  const agent = person.callSchedules[0]?.agent
  if (!agent) {
    throw new RetellError('No call schedule with agent found for this person')
  }

  const agentMetadata = agent.metadata as {
    retellFromNumber?: string
    retellAgentId?: string
    retellApiKey?: string
  } || {}

  try {
    const response = await triggerCall(person, {
      fromNumber: agentMetadata.retellFromNumber || process.env.RETELL_FROM_NUMBER || '',
      overrideAgentId: agentMetadata.retellAgentId || process.env.RETELL_DEFAULT_AGENT_ID,
      retellApiKey: agentMetadata.retellApiKey,
      dropIfMachine: true,
    })

    return {
      success: true,
      callId: response.call_id,
      agentId: agent.id
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate call'
    }
  }
}

export async function triggerCall(
    person: Person,
    options: RetellCallOptions
): Promise<RetellCallResponse> {
  if (!person.phoneNumber) {
    throw new RetellError('User has no phone number')
  }

  try {
    const client = getRetellClient(options.retellApiKey)

    const response = await client.call.createPhoneCall({
      from_number: options.fromNumber,
      to_number: person.phoneNumber,
      override_agent_id: options.overrideAgentId,
      metadata: {
        personId: person.id,
        name: person.name,
        ...options.metadata,
      },
      retell_llm_dynamic_variables: {
        customer_name: person.name,
        ...options.dynamicVariables,
      },
      //drop_if_machine_detected: options.dropIfMachine ?? true,
    })

    return response
  } catch (error) {
    if (error instanceof RetellError) {
      throw error
    }
    throw new RetellError(
        error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}
