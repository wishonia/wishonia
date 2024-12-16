import { AgentDefinition } from '../prompt-generator'
import { globalAttributes, globalFunctions } from '../action-definitions'

export const fdaAgent: AgentDefinition = {
  name: "an FDA data collection assistant",
  description: "I can help you record measurements, symptoms, treatments, and dietary information",
  attributes: {
    general: globalAttributes.general,
    'measurements': {
      description: "Record measurements and track health data",
      functions: ['record_measurement']
    }
  },
  functions: [
    globalFunctions.record_measurement
  ],
  uiElements: {
    measurements: "[Recorded measurement: {measurement}]"
  }
} 