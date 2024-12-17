import { cache } from "react";
import { Chat, ChatMessage } from "@prisma/client"
import { Message } from "ai";

import { getChats } from "@/app/actions"

import SidebarItems from "./ChatSidebarItems"

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

const loadChats = cache(async (userId: string):  Promise<Chat[]> => {
  const chats = await getChats(userId)
  return chats
})

export async function ChatSidebarList({ userId }: SidebarListProps) {
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
