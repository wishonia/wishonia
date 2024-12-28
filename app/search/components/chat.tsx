'use client'

import { useUIState } from 'ai/rsc'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { ChatMessages } from './chat-messages'
import { ChatPanel } from './chat-panel'


type ChatProps = {
  id?: string
  query?: string
}

export function Chat({ id, query }: ChatProps) {
  const path = usePathname()
  const [messages] = useUIState()

  useEffect(() => {
    if (!path.includes('search') && messages.length === 1) {
      window.history.replaceState({}, '', `/search/${id}`)
    }
  }, [id, path, messages, query])

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <ChatMessages messages={messages} />
      <ChatPanel messages={messages} query={query} />
    </div>
  )
}
