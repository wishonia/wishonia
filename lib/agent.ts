import { AgentType, LLMModel } from "@prisma/client"

import { prisma } from "@/lib/db"

export async function getOrCreateAgent(agentData: {
  name: string
  userId: string
  description?: string
  avatar?: string
  initialMessage?: string
  isActive?: boolean
  llmModel?: LLMModel
  metadata?: any
  outputSchema?: string
  prompt?: string
  type?: AgentType
  conversationStarters?: string[]
}) {
  return prisma.agent.upsert({
    where: {
      userId_name: {
        name: agentData.name,
        userId: agentData.userId,
      },
    },
    update: agentData,
    create: {
      name: agentData.name,
      userId: agentData.userId,
      description: agentData.description || "Add a agent description...",
      avatar: agentData.avatar,
      initialMessage:
        agentData.initialMessage || "Hello, how can I help you today?",
      isActive: agentData.isActive || false,
      llmModel: agentData.llmModel || LLMModel.GPT_3_5_TURBO,
      metadata: agentData.metadata,
      outputSchema: agentData.outputSchema,
      prompt: agentData.prompt || "You are a helpful AI Assistant",
      type: agentData.type || AgentType.LLM,
      conversationStarters: agentData.conversationStarters || [
        "What can you do?",
      ],
    },
  })
}

export async function createAgentDatasource(
  agentId: string,
  datasourceId: string
) {
  let data=await prisma.agentDatasource.findFirst({
    where:{
      agentId: agentId,
      datasourceId: datasourceId,
    }
  })
  if(data){
    return data;
  }
  return prisma.agentDatasource.create({
    data: {
      agentId: agentId,
      datasourceId: datasourceId,
    },
  })
}
