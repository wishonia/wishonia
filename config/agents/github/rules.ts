import { createRules } from '../base/scopes';

export const GITHUB_RULES = createRules({
  UI_ONLY: {
    id: 'ui_only',
    description: 'Never show raw data - always use UI components through function calls',
    priority: 1
  },
  SCOPE_FUNCTIONS: {
    id: 'scope_functions',
    description: 'Only use functions allowed by the current scope',
    priority: 2
  },
  SEARCH_CONSTRUCTION: {
    id: 'search_construction',
    description: 'Construct search queries using the appropriate qualifiers',
    priority: 3
  },
  USER_INPUT: {
    id: 'user_input',
    description: 'Always include user-provided inputs in the query',
    priority: 4
  },
  SCOPE_MODIFICATION: {
    id: 'scope_modification',
    description: 'Don\'t modify the attribute/scope - only users can change it',
    priority: 5
  }
}); 