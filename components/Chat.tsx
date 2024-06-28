'use client'

import { Message } from 'ai'
import ChatPanel from './ChatPanel'
import { sleep } from '@/lib/utils'
import { useToast } from './ui/use-toast'
import { PromptForm } from './PromptForm'
import { ChatMessage } from './ChatMessage'
import { ScrollArea } from './ui/scroll-area'
import { useUIState, useAIState } from 'ai/rsc'
import { useEffect, useRef, useState } from 'react'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {useSession} from "next-auth/react";
import { Agent } from '@prisma/client'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  missingKeys: string[]
  agentData?:Agent | null
}

function Chat({ id, missingKeys ,agentData}: ChatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const session = useSession()

  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  const messagesEndRef =
      useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 3) {
      sleep(500).then(() => {
        ref.current?.scrollTo(0, ref.current.scrollHeight)
        router.refresh()
      })
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  }, [])

  useEffect(() => {
    missingKeys.map((key) => {
      toast({
        title: 'Error',
        description: `Missing ${key} environment variable!`,
        variant: 'destructive',
      })
    })
  }, [missingKeys])

  return (
    <div className={`size-full`}>
      <ScrollArea className='size-full'>
        <div
            ref={ref}
            className={`w-full sm:max-w-2xl mx-auto sm:pt-0 pt-14 pb-36 sm:pb-28 ${isSidebarOpen && session ? 'lg:translate-x-[100px]' : ''} transition-all duration-300 ${messages.length !== 0 && 'px-3'}`}
        >
          <ChatMessage id={id} messages={messages}/>
          <div ref={messagesEndRef}/>
        </div>
        <ChatPanel agentData={agentData}/>
      </ScrollArea>
      <div
        className={`${messages.length !== 0 || pathname === '/chat' || pathname === '/' || pathname.includes('chat')? 'block' : 
        'hidden'} ${isSidebarOpen && session ? 'lg:translate-x-[100px]' : 
        ''} w-full mx-auto transition-all duration-300 fixed bottom-0 bg-gradient-to-t from-background to-transparent via-background`}
      >
        <PromptForm input={input} setInput={setInput} agent={agentData}/>
      </div>
    </div>
  )
}

export default Chat
