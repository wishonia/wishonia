import { notFound, redirect } from "next/navigation"

import { AI } from "@/lib/chat/actions"
import { getCurrentUser } from "@/lib/session"
import Chat from "@/components/Chat"
import { getChat, getMissingKeys } from "@/app/actions"
import { getAgent } from "@/lib/api/agents"

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser()
  const missingKeys = await getMissingKeys()
  let agent;
  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    redirect("/chat")
  }

  if (!chat[0]) {
    redirect("/chat")
  }

  if (chat[0].userId !== user?.id) {
    notFound()
  }
  if(chat[0].agentId){
    agent=await getAgent(chat[0].agentId)
  }

  return (
    <AI initialAIState={{ chatId: chat[0].id, messages: chat[0].messages, agent:agent }}>
      <Chat id={chat[0].id} missingKeys={missingKeys} agentData={agent}/>
    </AI>
  )
}
