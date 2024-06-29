import { Metadata } from "next"

import { getAgent } from "@/lib/api/agents"
import { AI } from "@/lib/chat/actions"
import { nanoid } from "@/lib/utils"
import Chat from "@/components/Chat"
import { getMissingKeys } from "@/app/actions"

interface AgentPageProps {
  params: { agentId: string }
}

export async function generateMetadata({
  params,
}: AgentPageProps): Promise<Metadata> {
  const agent = await getAgent(params.agentId)

  return {
    title: agent?.name || "Agent",
    description: agent?.description,
  }
}

export default async function AgentChatPage({ params }: AgentPageProps) {
  const missingKeys = await getMissingKeys()
  const id = nanoid()
  const agent = await getAgent(params.agentId)

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} missingKeys={missingKeys} agentData={agent} />
    </AI>
  )
}
