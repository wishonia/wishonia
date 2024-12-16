import { AgentDefinition } from '../prompt-generator'
import { globalAttributes, globalFunctions } from '../action-definitions'

export const githubAgent: AgentDefinition = {
  name: "a GitHub search bot",
  description: "I can help you find what you're looking for on GitHub using the GitHub API",
  attributes: {
    general: globalAttributes.general,
    'user-search': {
      description: "Search for GitHub users",
      functions: ['show_user_profile_ui', 'show_user_list_ui']
    },
    'repository-search': {
      description: "Search for GitHub repositories", 
      functions: ['show_repository_ui']
    }
  },
  functions: [
    globalFunctions.show_user_profile_ui,
    globalFunctions.show_user_list_ui,
    globalFunctions.show_repository_ui
  ],
  uiElements: {
    profile: "[GitHub Profile of '{username}']",
    repositories: "[Found repositories: '{repos}']",
    showRepos: "[User has clicked on the 'Show Repositories' button]"
  }
} 