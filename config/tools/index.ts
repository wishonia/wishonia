import { GITHUB_TOOL } from './definitions/github'
import { FDAI_TOOL } from './definitions/fdai'
import type { BaseTool } from './definitions/base'

export const AVAILABLE_TOOLS: BaseTool[] = [
  GITHUB_TOOL,
  FDAI_TOOL
]

export * from './definitions/base'
export * from './definitions/github'
export * from './definitions/fdai' 