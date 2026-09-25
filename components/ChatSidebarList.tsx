import { cache } from "react";
import { Chat, ChatMessage } from "@prisma/client"
import { Message } from "ai";

import { getChats } from "@/app/actions"

import ChatSidebarItems from "./ChatSidebarItems"

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

const loadChats = cache(async ():  Promise<Chat[]> => {
  const chats = await getChats()
  return chats
})

export async function ChatSidebarList() {
  const chats = await loadChats()
  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
      {chats?.length ? (
        <ChatSidebarItems chats={chats} />
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
