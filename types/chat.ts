export type Role = 'user' | 'assistant' | 'system'

export interface Message {
  role: Role
  content: string
}

export interface ChatCompletion {
  id: string
  model: string
  created: number
  choices: {
    index: number
    message: Message
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ChatOptions {
  model: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
  messages: Message[]
  response_format?: {
    type: "text" | "json_object"
  }
} 