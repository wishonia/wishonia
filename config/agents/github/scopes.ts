import { createScope } from '../base/scopes';

export const GITHUB_SCOPES = createScope({
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
}); 