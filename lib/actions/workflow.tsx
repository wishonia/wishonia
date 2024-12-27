'use server'

import { CoreMessage, generateId } from 'ai'
import { createStreamableValue, createStreamableUI } from 'ai/rsc'
import React from 'react'

import { FollowupPanel } from '@/app/search/components/followup-panel'
import { Section } from '@/app/search/components/section'
import { Spinner } from '@/components/ui/spinner'
import {
  querySuggestor,
  inquire,
  taskManager,
  researcherWithOllama,
  researcher
} from '@/lib/agents'

export async function workflow(
  uiState: {
    uiStream: ReturnType<typeof createStreamableUI>
    isCollapsed: ReturnType<typeof createStreamableValue>
    isGenerating: ReturnType<typeof createStreamableValue>
  },
  aiState: any,
  messages: CoreMessage[],
  skip: boolean
) {
  const { uiStream, isCollapsed, isGenerating } = uiState
  const id = generateId()

  // Display spinner
  uiStream.append(<Spinner />)

  let action = { object: { next: 'proceed' } }
  // If the user does not skip the task, run the task manager
  if (!skip) action = (await taskManager(messages)) ?? action

  if (action.object.next === 'inquire') {
    // Generate inquiry
    const inquiry = await inquire(uiStream, messages)
    uiStream.done()
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: 'assistant',
          content: `inquiry: ${inquiry?.question}`,
          type: 'inquiry'
        }
      ]
    })

    isCollapsed.done(false)
    isGenerating.done(false)
    return
  }

  // Set the collapsed state to true
  isCollapsed.done(true)

  const useOllama = process.env.OLLAMA_MODEL && process.env.OLLAMA_BASE_URL
  // Select the appropriate researcher function based on the environment variables
  const { text, toolResults } = useOllama
    ? await researcherWithOllama(uiStream, messages)
    : await researcher(uiStream, messages)

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      ...toolResults.map((toolResult: any) => ({
        id,
        role: 'tool',
        content: JSON.stringify(toolResult.result),
        name: toolResult.toolName,
        type: 'tool'
      })),
      {
        id,
        role: 'assistant',
        content: text,
        type: 'answer'
      }
    ]
  })

  const messagesWithAnswer: CoreMessage[] = [
    ...messages,
    {
      role: 'assistant',
      content: text
    }
  ]

  // Generate related queries
  const relatedQueries = await querySuggestor(uiStream, messagesWithAnswer)
  // Add follow-up panel
  uiStream.append(
    <Section title="Follow-up">
      <FollowupPanel />
    </Section>
  )

  uiStream.done()
  isGenerating.done(false)

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id,
        role: 'assistant',
        content: JSON.stringify(relatedQueries),
        type: 'related'
      },
      {
        id,
        role: 'assistant',
        content: 'followup',
        type: 'followup'
      }
    ]
  })
}
