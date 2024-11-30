import { Message } from '@/types/chat'

export class ChatHistory {
  private messages: Message[] = []

  addMessage(message: Message): void {
    this.messages.push(message)
  }

  getMessages(): Message[] {
    return [...this.messages]
  }

  clear(): void {
    this.messages = []
  }

  getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1]
  }
} 