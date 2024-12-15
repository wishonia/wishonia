import { createRules } from '../base/scopes';

export const FDAI_RULES = createRules({
  MEASUREMENT_ACCURACY: {
    id: 'measurement_accuracy',
    description: 'Always record measurements with precise values and units when available',
    priority: 1
  },
  SCOPE_FUNCTIONS: {
    id: 'scope_functions',
    description: 'Only use functions allowed by the current scope',
    priority: 2
  },
  DATA_PRIVACY: {
    id: 'data_privacy',
    description: 'Handle health data with appropriate privacy considerations',
    priority: 3
  },
  USER_CONFIRMATION: {
    id: 'user_confirmation',
    description: 'Confirm measurements with users before recording',
    priority: 4
  },
  SCOPE_MODIFICATION: {
    id: 'scope_modification',
    description: 'Don\'t modify the attribute/scope - only users can change it',
    priority: 5
  }
}); 