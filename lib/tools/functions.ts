import { ToolType } from "@prisma/client"

// Define function types
export type ToolFunction = (...args: any[]) => Promise<any>

// Default tool configurations
export const DEFAULT_TOOLS = [
  {
    id: 'github-tool',
    name: 'GitHub',
    type: ToolType.GITHUB,
    description: 'Search and interact with GitHub',
    toolConfig: {
      functions: ['show_user_profile_ui', 'show_repository_ui', 'show_readme_ui']
    }
  },
  {
    id: 'function-tool',
    name: 'Function',
    type: ToolType.FUNCTION,
    description: 'Execute functions',
    toolConfig: {
      functions: ['measurement_action']
    }
  },
  {
    id: 'research-tool',
    name: 'Research',
    type: ToolType.RESEARCH,
    description: 'Search research papers',
    toolConfig: {
      functions: ['search_pubmed']
    }
  }
] as const

// Function implementations
export const toolFunctions: Partial<Record<ToolType, Record<string, ToolFunction>>> = {
  [ToolType.GITHUB]: {
    show_user_profile_ui: async () => ({}),
    show_repository_ui: async () => ({}),
    show_readme_ui: async () => ({})
  },
  [ToolType.FUNCTION]: {
    measurement_action: async () => ({})
  },
  [ToolType.RESEARCH]: {
    search_pubmed: async () => ({ results: [] })
  }
} 