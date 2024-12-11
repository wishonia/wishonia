import { notFound, redirect } from "next/navigation"
import { Message } from "ai"
import { getAgent } from "@/lib/api/agents"
import { AI } from "@/lib/chat/actions"
import { getCurrentUser } from "@/lib/session"
import Chat from "@/components/Chat"
import { getChat, getMissingKeys } from "@/app/actions"
import { ChatMessage } from "@prisma/client"

export interface ChatPageProps {
  params: {
    id: string
  }
}

function convertToAIMessage(message: ChatMessage): Message {
  const validRoles = ['user', 'assistant', 'system', 'function'] as const;
  if (!validRoles.includes(message.role as any)) {
    throw new Error(`Invalid message role: ${message.role}`);
  }

  let parsedToolCalls;
  if (message.tool_calls) {
    try {
      parsedToolCalls = JSON.parse(message.tool_calls);
    } catch (e) {
      console.error('Failed to parse tool_calls:', e);
      parsedToolCalls = undefined;
    }
  }

  return {
    id: message.id,
    content: message.content,
    role: message.role as Message['role'],
    name: message.name ?? undefined,
    function_call: message.function_call ?? undefined,
    tool_calls: parsedToolCalls,
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser()
  const missingKeys = await getMissingKeys()
  let agent
  
  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat || !chat[0]) {
    redirect("/chat")
  }

  if (chat[0].userId !== user?.id) {
    notFound()
  }

  if (chat[0].agentId) {
    agent = await getAgent(chat[0].agentId)
  }

  const aiMessages = chat[0].messages.map(convertToAIMessage)

  return (
    <AI
      initialAIState={{
        chatId: chat[0].id,
        messages: aiMessages,
        agent: agent,
      }}
    >
      <Chat id={chat[0].id} missingKeys={missingKeys} agentData={agent} />
    </AI>
  )
}
