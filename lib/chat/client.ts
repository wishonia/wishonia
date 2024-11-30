import { ChatOptions, Message, ChatCompletion } from '@/types/chat'

export class ChatClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl = 'https://api.openai.com/v1') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  async createChatCompletion(
    messages: Message[],
    options: ChatOptions
  ): Promise<ChatCompletion> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        ...options,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    return response.json()
  }
} 