import { ToolType, AgentType, SharingLevel, LLMModel } from "@prisma/client"
import type { AgentConfig } from "./types"

// Define available scopes/attributes
const GITHUB_SCOPES = {
  GENERAL: {
    name: 'general',
    description: 'General purpose scope for any GitHub-related queries',
    allowedFunctions: ['show_user_profile_ui', 'show_user_list_ui', 'show_repository_ui', 'show_readme_ui']
  },
  USER_SEARCH: {
    name: 'user-search',
    description: 'Search for GitHub user profiles',
    allowedFunctions: ['show_user_profile_ui', 'show_user_list_ui']
  },
  REPOSITORY_SEARCH: {
    name: 'repository_search',
    description: 'Search for GitHub repositories',
    allowedFunctions: ['show_repository_ui', 'show_readme_ui']
  },
  WISHONIA_INFO: {
    name: 'ask_about_wishonia',
    description: 'Get information about Wishonia',
    allowedFunctions: ['ask_about_wishonia']
  },
  CODE_SEARCH: {
    name: 'code_search',
    description: 'Search for code snippets',
    allowedFunctions: []
  }
} as const

// Define search query construction rules
const SEARCH_QUALIFIERS = {
  NAME: {
    qualifier: 'in:name',
    description: 'Search in user\'s full name',
    example: 'Jane+in:name'
  },
  USERNAME: {
    qualifier: 'in:login',
    description: 'Search in username',
    example: 'jane+in:login'
  },
  EMAIL: {
    qualifier: 'in:email',
    description: 'Search in email address',
    example: 'example@example.com+in:email'
  },
  LOCATION: {
    qualifier: 'location:',
    description: 'Filter by user location',
    example: 'location:Berlin'
  },
  FOLLOWERS: {
    qualifier: 'followers:',
    description: 'Filter by number of followers',
    example: 'followers:>100, followers:250..500'
  },
  BIO: {
    qualifier: 'in:bio',
    description: 'Search in user bio',
    example: 'developer+in:bio'
  }
} as const

// Generate the prompt dynamically
function generateSystemPrompt() {
  const scopeDescriptions = Object.values(GITHUB_SCOPES)
    .map(scope => `  - '${scope.name}' means that ${scope.description}.${
      scope.allowedFunctions.length ? ` Functions allowed: ${scope.allowedFunctions.join(', ')}` : ''
    }`)
    .join('\n')

  const searchExamples = [
    'Jane+in:name" - Search for people named Jane',
    'example@example.com+in:email" - Search for emails',
    'John+in:name+location:Seattle" - Search for people named John in Seattle',
    'Alice+in:name+followers:50..150" - Search for people named Alice with 50-150 followers',
    'Mike+in:name+location:New+York+followers:>50+developer+in:bio" - Complex search combining multiple qualifiers'
  ].map(ex => `- "${ex}`).join('\n')

  return `\
You are a GitHub search bot and you can help users find what they are looking for by searching the GitHub using GitHub API.
You can only show information through UI components by calling the appropriate functions.

Available scopes/attributes:
${scopeDescriptions}

Messages inside [] represent UI events or states, for example:
- "[User has changed attribute to 'user-search']" means the user changed the search scope
- "[GitHub Profile of 'wishonia']" means the profile UI is being displayed
- "[User has clicked on 'Show Repositories']" means the user requested repository list
- "[Found repositories: 'repo1', 'repo2', 'repo3']" means search results are displayed

Search Query Construction:
You can combine these search qualifiers to create precise searches:
${searchExamples}

Rules:
1. Never show raw data - always use UI components through function calls
2. Only use functions allowed by the current scope
3. Construct search queries using the appropriate qualifiers
4. Always include user-provided inputs in the query
5. Don't modify the attribute/scope - only users can change it`
}

export const GITHUB_AGENT: AgentConfig = {
  name: "GitHub Assistant",
  description: "Helps users find and explore GitHub repositories",
  prompt: generateSystemPrompt(),
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
} 