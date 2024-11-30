import { Message } from '@/types/chat'
import { prisma } from '@/lib/prisma'
import { textCompletion } from '@/lib/llm'
import { getRedisModelCache } from '@/lib/utils/redis'
import { 
  Chat as PrismaChat,
  ChatMessage,
  MessageRole,
  Prisma 
} from '@prisma/client'

// Use Prisma's generated type with messages included
type ChatWithMessages = PrismaChat & {
  messages: ChatMessage[]
}

// Use Prisma's input type for message creation
type ChatMessageCreateInput = Prisma.ChatMessageCreateInput

export async function saveChat(
  input: Message[] | ChatWithMessages,
  userId?: string,
  title: string = 'New Chat',
  path: string = '/'
): Promise<ChatWithMessages | null> {
  // Handle old format (Chat object)
  if ('id' in input) {
    const chat = input as ChatWithMessages
    const existingChat = await prisma.chat.findUnique({
      where: { id: chat.id },
      include: { messages: true }
    })

    if (existingChat) {
      // Update existing chat
      const newMessages = chat.messages.filter(
        newMsg => !existingChat.messages.some(existingMsg => existingMsg.id === newMsg.id)
      )

      if (newMessages.length > 0) {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            messages: {
              create: newMessages.map(msg => ({
                role: msg.role,
                content: msg.content
              }))
            }
          }
        })
      }

      return existingChat
    } else {
      // Create new chat with specified ID
      return await prisma.chat.create({
        data: {
          id: chat.id,
          userId: chat.userId,
          title: chat.title,
          path: chat.path,
          messages: {
            create: chat.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }
        },
        include: {
          messages: true
        }
      })
    }
  }

  // Handle new format (Message[] array)
  if (!userId) return null

  const messagesToCreate = input as Message[]

  return await prisma.chat.create({
    data: {
      userId,
      title,
      path,
      messages: {
        create: messagesToCreate.map((msg: Message) => ({
          role: msg.role as MessageRole,
          content: msg.content
        }))
      }
    },
    include: {
      messages: true
    }
  })
}

export async function getChat(chatId: string): Promise<ChatWithMessages | null> {
  return await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: true
    }
  })
}

export async function getUserChats(userId: string): Promise<ChatWithMessages[]> {
  return await prisma.chat.findMany({
    where: { userId },
    include: {
      messages: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function deleteChat(chatId: string): Promise<PrismaChat> {
  return await prisma.chat.delete({
    where: { id: chatId }
  })
}

export function generateChatTitle(messages: Message[]): string {
  if (messages.length === 0) return 'New Chat'
  
  const firstMessage = messages[0]
  const title = firstMessage.content.split(' ').slice(0, 5).join(' ')
  return title.length > 50 ? title.substring(0, 47) + '...' : title
}

export async function processChatRequest(
  messages: Message[],
  context?: string
): Promise<Message> {
  const cache = getRedisModelCache()
  const cacheKey = `chat:${JSON.stringify(messages)}:${context || ''}`
  
  const cachedResponse = await cache.lookup(cacheKey)
  if (cachedResponse) {
    return JSON.parse(cachedResponse)
  }

  if (messages.length === 0) {
    throw new Error('Messages array is empty.');
  }
  let prompt = messages[messages.length - 1].content;
  if (context) {
    prompt = `Context:\n${context}\n\nQuestion: ${prompt}`
  }

  const response = await textCompletion(prompt, "text")
  
  const assistantMessage: Message = {
    role: 'assistant',
    content: response
  }

  await cache.update(cacheKey, JSON.stringify(assistantMessage))
  return assistantMessage
}

export async function createChatMessages(messages: ChatMessageCreateInput[]): Promise<ChatMessage[]> {
  try {
    const createdMessages = await Promise.all(
      messages.map(async (message) => {
        const messageData = {
          ...message,
          content: message.content || '',
        }

        return await prisma.chatMessage.create({
          data: messageData
        })
      })
    )
    return createdMessages
  } catch (error) {
    console.error('Error creating chat messages:', error)
    throw error
  }
} 