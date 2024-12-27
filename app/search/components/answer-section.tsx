'use client'

import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { useEffect, useState } from 'react'

import { DefaultSkeleton } from './default-skeleton'
import { BotMessage } from './message'
import { Section } from './section'

export type AnswerSectionProps = {
  result?: StreamableValue<string>
  hasHeader?: boolean
}

export function AnswerSection({
  result,
  hasHeader = true
}: AnswerSectionProps) {
  const [data, error, pending] = useStreamableValue(result)
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    if (!data) return
    setContent(data)
  }, [data])

  return (
    <div>
      {content.length > 0 ? (
        <Section title={hasHeader ? 'Answer' : undefined}>
          <BotMessage content={content} />
        </Section>
      ) : (
        <DefaultSkeleton />
      )}
    </div>
  )
}
