import { ModelName } from '@/lib/utils/modelUtils';

export const MODEL_PRICING: Record<ModelName, { input: number; output: number }> = {
  // OpenAI GPT-4 Models
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4-turbo-2024-04-09': { input: 0.01, output: 0.03 },
  'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
  'gpt-4-0125-preview': { input: 0.01, output: 0.03 },
  'gpt-4-1106-preview': { input: 0.01, output: 0.03 },
  'gpt-4-0613': { input: 0.03, output: 0.06 },
  
  // OpenAI GPT-4-O Models
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-2024-05-13': { input: 0.0025, output: 0.01 },
  'gpt-4o-2024-08-06': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4o-mini-2024-07-18': { input: 0.00015, output: 0.0006 },
  
  // OpenAI GPT-3.5 Models
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'gpt-3.5-turbo-0125': { input: 0.0005, output: 0.0015 },
  'gpt-3.5-turbo-1106': { input: 0.0005, output: 0.0015 },
  
  // Anthropic Claude Models
  'claude-3-5-sonnet-20240620': { input: 0.003, output: 0.015 },
  'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
  'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
  'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  
  // Google Gemini Models
  'gemini-1.5-pro': { input: 0.0035, output: 0.0105 },
  'gemini-1.5-pro-latest': { input: 0.0035, output: 0.0105 },
  'gemini-1.5-flash': { input: 0.00075, output: 0.0035 },
  'gemini-1.5-flash-latest': { input: 0.00075, output: 0.0035 },
  'gemini-1.0-pro': { input: 0.0035, output: 0.0105 }
} as const; 