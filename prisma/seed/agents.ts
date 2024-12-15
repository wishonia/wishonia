import { PrismaClient, AgentType, ToolType, User } from '@prisma/client'
import { AVAILABLE_AGENTS } from '@/config/agents'
import { AVAILABLE_TOOLS } from '@/config/tools'
import type { AgentConfig } from '@/config/agents'
import { getOrCreateTestUser } from '@/tests/test-helpers'

const prisma = new PrismaClient()

async function createTool(toolConfig: typeof AVAILABLE_TOOLS[0], testUser: User) {
  // First find if tool exists
  const existingTool = await prisma.tool.findFirst({
    where: { 
      name: toolConfig.name,
      type: toolConfig.type,
      userId: testUser.id
    }
  })

  if (existingTool) {
    return prisma.tool.update({
      where: { id: existingTool.id },
      data: { 
        description: toolConfig.description,
        metadata: toolConfig.metadata
      }
    })
  }

  return prisma.tool.create({
    data: {
      name: toolConfig.name,
      type: toolConfig.type,
      description: toolConfig.description,
      metadata: toolConfig.metadata,
      userId: testUser.id
    }
  })
}

async function createAgent(config: AgentConfig, testUser: User) {
  // Create agent
  const agent = await prisma.agent.create({
    data: {
      name: config.name,
      description: config.description,
      prompt: config.prompt,
      avatar: config.avatar,
      initialMessage: config.initialMessage,
      conversationStarters: config.conversationStarters,
      type: config.type,
      isActive: config.isActive,
      metadata: config.metadata ?? undefined,
      sharingLevel: config.sharingLevel,
      userId: config.userId,
      llmModel: config.llmModel,
      outputSchema: config.outputSchema
    }
  })

  // Create tool associations
  for (const toolType of config.defaultTools) {
    const tool = await prisma.tool.findFirst({
      where: { type: toolType }
    })
    
    if (tool) {
      await prisma.agentTool.upsert({
        where: {
          agentId_toolId: {
            agentId: agent.id,
            toolId: tool.id
          }
        },
        update: {},
        create: {
          agentId: agent.id,
          toolId: tool.id
        }
      })
    }
  }

  return agent
}

export async function seedAgents() {
  const testUser = await getOrCreateTestUser()

  // Create all tools
  for (const toolConfig of AVAILABLE_TOOLS) {
    await createTool(toolConfig, testUser)
  }

  // Create all agents
  for (const agentConfig of AVAILABLE_AGENTS) {
    await createAgent(agentConfig, testUser)
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedAgents()
    .then(() => console.log('Agents seeded successfully'))
    .catch(console.error)
    .finally(() => prisma.$disconnect())
} 