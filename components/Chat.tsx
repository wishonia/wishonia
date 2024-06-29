"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Agent } from "@prisma/client"
import { Message } from "ai"
import { useAIState, useUIState } from "ai/rsc"
import { useSession } from "next-auth/react"

import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { sleep } from "@/lib/utils"

import { ChatMessage } from "./ChatMessage"
import ChatPanel from "./ChatPanel"
import { PromptForm } from "./PromptForm"
import { ScrollArea } from "./ui/scroll-area"
import { useToast } from "./ui/use-toast"

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[]
  id: string
  missingKeys: string[]
  agentData?: Agent | null
}

function Chat({ id, missingKeys, agentData }: ChatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const session = useSession()

  const [input, setInput] = useState("")
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()

  const [_, setNewChatId] = useLocalStorage("newChatId", id)
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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
        title: "Error",
        description: `Missing ${key} environment variable!`,
        variant: "destructive",
      })
    })
  }, [missingKeys])

  return (
    <div className={`size-full`}>
      <ScrollArea className="size-full">
        <div
          ref={ref}
          className={`mx-auto w-full pb-36 pt-14 sm:max-w-2xl sm:pb-28 sm:pt-0 ${isSidebarOpen && session ? "lg:translate-x-[100px]" : ""} transition-all duration-300 ${messages.length !== 0 && "px-3"}`}
        >
          <ChatMessage id={id} messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        <ChatPanel agentData={agentData} />
      </ScrollArea>
      <div
        className={`${
          messages.length !== 0 ||
          pathname === "/chat" ||
          pathname === "/" ||
          pathname.includes("chat")
            ? "block"
            : "hidden"
        } ${
          isSidebarOpen && session ? "lg:translate-x-[100px]" : ""
        } fixed bottom-0 mx-auto w-full bg-gradient-to-t from-background via-background to-transparent transition-all duration-300`}
      >
        <PromptForm input={input} setInput={setInput} agent={agentData} />
      </div>
    </div>
  )
}

export default Chat
