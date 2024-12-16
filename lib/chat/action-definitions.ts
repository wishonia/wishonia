import { z } from 'zod'

// Define shared attribute types that can be used across agents
export const globalAttributes = {
  general: {
    description: "General purpose interactions and queries",
    functions: ['*'] as readonly string[]
  }
} as const

// Define function schemas that can be reused
export const functionSchemas = {
  show_user_profile_ui: z.object({
    username: z.string().describe("The username of the user to search for")
  }),
  
  show_user_list_ui: z.object({
    query: z.string().describe("The query to search for users")
  }),

  show_repository_ui: z.object({
    query: z.string().describe("The query to search for repositories")
  }),

  record_measurement: z.object({
    text: z.string().describe("The text containing measurements to record")
  })
} as const

// Define the actual functions with their full definitions
export const globalFunctions = {
  show_user_profile_ui: {
    name: 'show_user_profile_ui',
    description: "Show the found user profile UI",
    parameters: functionSchemas.show_user_profile_ui,
    category: 'github'
  },

  show_user_list_ui: {
    name: 'show_user_list_ui', 
    description: "Show the found user list UI",
    parameters: functionSchemas.show_user_list_ui,
    category: 'github'
  },

  show_repository_ui: {
    name: 'show_repository_ui',
    description: "Show the found repositories UI", 
    parameters: functionSchemas.show_repository_ui,
    category: 'github'
  },

  record_measurement: {
    name: 'record_measurement',
    description: "Record measurements from natural language text",
    parameters: functionSchemas.record_measurement,
    category: 'measurements'
  }
} as const 