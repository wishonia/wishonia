import { AgentType, SharingLevel, LLMModel, ToolType } from "@prisma/client"
import { generateAgentPrompt } from '../base/prompt'
import { FDAI_SCOPES } from './scopes'
import { FDAI_RULES } from './rules'
import type { AgentConfig } from "../types"

const FDAI_EXAMPLES = [
  'I took 500mg of vitamin C',
  'My headache is at 7 out of 10',
  'I ate a banana for breakfast',
  'Blood pressure is 120/80',
  'Search for research about migraine treatments',
  'Show me my symptom trends for the last week'
];

const FDAI_UI_EVENTS = [
  "[Measurement recorded: '500mg vitamin C'] - Medication intake recorded",
  "[Symptom recorded: 'Headache level 7'] - Symptom severity recorded",
  "[Food recorded: 'Banana'] - Food intake recorded",
  "[Analysis requested: 'Symptom trends'] - Trend analysis requested"
];

export const FDAI_AGENT: AgentConfig = {
  name: "FDAi Assistant",
  description: "Helps track health measurements and analyze medical data",
  prompt: generateAgentPrompt({
    agentDescription: "You are an AI assistant that helps users track their health data and analyze medical information.",
    scopes: FDAI_SCOPES,
    rules: Object.values(FDAI_RULES),
    examples: FDAI_EXAMPLES,
    uiEvents: FDAI_UI_EVENTS
  }),
  defaultTools: [
    ToolType.FUNCTION,
    ToolType.RESEARCH,
    ToolType.PUBMED
  ],
  initialMessage: "Hello! I'm here to help you track your health data and find medical information. What would you like to do?",
  avatar: "🏥",
  conversationStarters: [
    "Record my medication",
    "Track my symptoms",
    "Find research about a condition",
    "Log what I ate today",
    "Search for treatment information"
  ],
  type: AgentType.SUPERAGENT,
  isActive: true,
  metadata: null,
  sharingLevel: SharingLevel.PRIVATE,
  userId: "system",
  llmModel: LLMModel.GPT_3_5_TURBO_16K_0613,
  outputSchema: null
}; 