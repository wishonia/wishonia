import { createScope } from '../base/scopes';

export const FDAI_SCOPES = createScope({
  GENERAL: {
    name: 'general',
    description: 'General purpose scope for health tracking and medical information',
    allowedFunctions: ['record_measurement', 'search_pubmed', 'analyze_trends']
  },
  MEASUREMENT: {
    name: 'measurement',
    description: 'Record and track health measurements',
    allowedFunctions: ['record_measurement', 'analyze_trends']
  },
  RESEARCH: {
    name: 'research',
    description: 'Search and analyze medical research',
    allowedFunctions: ['search_pubmed']
  },
  ANALYSIS: {
    name: 'analysis',
    description: 'Analyze health data and trends',
    allowedFunctions: ['analyze_trends']
  }
}); 