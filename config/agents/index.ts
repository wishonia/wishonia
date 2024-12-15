import { GITHUB_AGENT } from './github'
import { FDAI_AGENT } from './fdai'
import type { AgentConfig } from './types'

export const AVAILABLE_AGENTS: AgentConfig[] = [
  GITHUB_AGENT,
  FDAI_AGENT
]

export * from './types'
export * from './base/scopes'
export * from './base/prompt'
export * from './github'
export * from './fdai' 