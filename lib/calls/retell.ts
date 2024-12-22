import { Person } from '@prisma/client'
import Retell from 'retell-sdk';
import type { CallResponse } from 'retell-sdk/resources/call';

function getRetellClient() {
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    throw new RetellError('RETELL_API_KEY environment variable is not set')
  }
  return new Retell({ apiKey })
}

interface RetellCallOptions {
  fromNumber: string
  overrideAgentId?: string
  metadata?: Record<string, any>
  dynamicVariables?: Record<string, any>
  dropIfMachine?: boolean
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

export async function triggerCall(
  person: Person,
  options: RetellCallOptions
): Promise<RetellCallResponse> {
  console.log('Attempting to trigger call for user:', {
    userId: person.id,
    hasPhoneNumber: !!person.phoneNumber,
    options
  })

  if (!person.phoneNumber) {
    throw new RetellError('User has no phone number')
  }

  try {
    const client = getRetellClient()
    
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

    console.log('Retell API success response:', response)
    return response
  } catch (error) {
    console.error('Error in triggerCall:', error)
    if (error instanceof RetellError) {
      throw error
    }
    throw new RetellError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

export async function getCallStatus(callId: string): Promise<RetellCallResponse> {
  try {
    const client = getRetellClient()
    const response = await client.call.retrieve(callId)
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