import { cache } from "react"
import { Message } from "ai"
import { ChatMessage } from "@prisma/client"

import { getChats } from "@/app/actions"

import SidebarItems from "./SidebarItems"

interface SidebarListProps {
  userId: string
  children?: React.ReactNode
}

function convertToAIMessage(message: ChatMessage): Message {
  return {
    id: message.id,
    content: message.content,
    role: message.role as Message['role'],
    name: message.name ?? undefined,
    function_call: message.function_call ?? undefined,
    tool_calls: message.tool_calls ? JSON.parse(message.tool_calls) : undefined,
  }
}

const loadChats = cache(async (userId: string) => {
  const chats = await getChats(userId)
  return chats?.map(chat => ({
    ...chat,
    messages: chat.messages.map(convertToAIMessage)
  }))
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)
  return (
    <div className="size-full">
      {chats?.length ? (
        <SidebarItems chats={chats} />
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
