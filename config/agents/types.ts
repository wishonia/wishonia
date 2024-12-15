import { ToolType, Agent } from "@prisma/client"

// Available agent types
export const AVAILABLE_AGENTS = {
  GITHUB_AGENT: 'github',
  FDAI_AGENT: 'fdai'
} as const

export type AvailableAgent = typeof AVAILABLE_AGENTS[keyof typeof AVAILABLE_AGENTS]

// We extend the Prisma Agent type to add the defaultTools field needed for seeding
export type AgentConfig = Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> & {
  defaultTools: ToolType[]
  conversationStarters: string[]
}