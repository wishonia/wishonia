import { User } from '@prisma/client'

interface RetellCallOptions {
  fromNumber: string
  overrideAgentId?: string
  metadata?: Record<string, any>
  dynamicVariables?: Record<string, any>
  dropIfMachine?: boolean
}

interface RetellCallResponse {
  call_id: string
  status: string
  created_at: string
  // Add other response fields as needed
}

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
  user: User,
  options: RetellCallOptions
): Promise<RetellCallResponse> {
  console.log('Attempting to trigger call for user:', {
    userId: user.id,
    hasPhoneNumber: !!user.phoneNumber,
    options
  })

  if (!user.phoneNumber) {
    throw new RetellError('User has no phone number')
  }

  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    throw new RetellError('RETELL_API_KEY environment variable is not set')
  }

  try {
    const requestBody = {
      from_number: options.fromNumber,
      to_number: user.phoneNumber,
      override_agent_id: options.overrideAgentId,
      metadata: {
        userId: user.id,
        userName: user.name,
        ...options.metadata,
      },
      retell_llm_dynamic_variables: {
        customer_name: user.name,
        ...options.dynamicVariables,
      },
      drop_call_if_machine_detected: options.dropIfMachine ?? true,
    }

    console.log('Making Retell API request:', {
      url: 'https://api.retellai.com/create-phone-call',
      body: requestBody,
      hasApiKey: !!apiKey
    })

    const response = await fetch('https://api.retellai.com/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Retell API response:', {
      status: response.status,
      ok: response.ok,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Retell API error details:', errorData)
      throw new RetellError(
        'Failed to create call',
        response.status,
        errorData
      )
    }

    const responseData = await response.json()
    console.log('Retell API success response:', responseData)
    return responseData
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
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) {
    throw new RetellError('RETELL_API_KEY environment variable is not set')
  }

  try {
    const response = await fetch(`https://api.retellai.com/calls/${callId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new RetellError(
        'Failed to get call status',
        response.status,
        await response.json()
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof RetellError) {
      throw error
    }
    throw new RetellError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
} 