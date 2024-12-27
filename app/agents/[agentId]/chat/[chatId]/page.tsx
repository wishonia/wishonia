import { ChatMessage } from "@prisma/client"
import { Message } from "ai"
import { notFound, redirect } from "next/navigation"

import { getChat, getMissingKeys } from "@/app/actions"
import Chat from "@/components/Chat"
import { AI } from "@/lib/chat/actions"
import { getCurrentUser } from "@/lib/session"


export interface ChatPageProps {
  params: {
    chatId: string
    agentId: string
  }
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

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser()
  const missingKeys = await getMissingKeys()

  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/agents/${params.agentId}/chat/${params.chatId}`)
  }

  const chat = await getChat(params.chatId, user.id)

  if (!chat || !chat[0]) {
    redirect(`/agents/${params.agentId}/chat`)
  }

  if (chat[0].userId !== user?.id) {
    notFound()
  }

  const aiMessages = chat[0].messages.map(convertToAIMessage)

  return (
    <AI initialAIState={{ chatId: chat[0].id, messages: aiMessages, agent: chat[0].agent }}>
      <Chat id={chat[0].id} missingKeys={missingKeys} agentData={chat[0].agent} />
    </AI>
  )
}
