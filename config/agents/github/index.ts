import { AgentType, SharingLevel, LLMModel, ToolType } from "@prisma/client"
import { generateAgentPrompt } from '../base/prompt'
import { GITHUB_SCOPES } from './scopes'
import { GITHUB_QUALIFIERS } from './qualifiers'
import { GITHUB_RULES } from './rules'
import type { AgentConfig } from "../types"

const GITHUB_EXAMPLES = [
  'Jane+in:name" - Search for people named Jane',
  'example@example.com+in:email" - Search for emails',
  'John+in:name+location:Seattle" - Search for people named John in Seattle',
  'Alice+in:name+followers:50..150" - Search for people named Alice with 50-150 followers',
  'Mike+in:name+location:New+York+followers:>50+developer+in:bio" - Complex search combining multiple qualifiers'
];

const GITHUB_UI_EVENTS = [
  "[User has changed attribute to 'user-search'] - User changed the search scope",
  "[GitHub Profile of 'wishonia'] - Profile UI is being displayed",
  "[User has clicked on 'Show Repositories'] - User requested repository list",
  "[Found repositories: 'repo1', 'repo2', 'repo3'] - Search results are displayed"
];

export const GITHUB_AGENT: AgentConfig = {
  name: "GitHub Assistant",
  description: "Helps users find and explore GitHub repositories",
  prompt: generateAgentPrompt({
    agentDescription: "You are a GitHub search bot that helps users find information using the GitHub API.",
    scopes: GITHUB_SCOPES,
    qualifiers: GITHUB_QUALIFIERS,
    rules: Object.values(GITHUB_RULES),
    examples: GITHUB_EXAMPLES,
    uiEvents: GITHUB_UI_EVENTS
  }),
  defaultTools: [
    ToolType.GITHUB,
    ToolType.FUNCTION
  ],
  initialMessage: "Hello! I can help you explore GitHub repositories and users. What would you like to find?",
  avatar: "🐙",
  conversationStarters: [
    "Find repositories about machine learning",
    "Show me the profile of a specific GitHub user",
    "Search for JavaScript developers",
    "Find trending repositories"
  ],
  type: AgentType.SUPERAGENT,
  isActive: true,
  metadata: null,
  sharingLevel: SharingLevel.PRIVATE,
  userId: "system",
  llmModel: LLMModel.GPT_3_5_TURBO_16K_0613,
  outputSchema: null
}; 