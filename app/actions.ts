'use server'

import { prisma } from '@/lib/db'
import { type Chat } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { QueryCache } from '@tanstack/react-query'
import { getCurrentUser } from "@/lib/session";
import { type Message as AIMessage } from 'ai';
import {ChatMessage} from "@prisma/client";

type GetChatResult = Chat[] | null
type SetChatResults = Chat[]

export async function getChat(id: string, loggedInUserId: string): Promise<SetChatResults> {
  const receivedChat = await prisma.chat.findFirst({
    where: {
      id,
      userId: loggedInUserId,
    },
    include: {
      messages: true,
    }
  })

  if (!receivedChat) {
    return []
  }

  // Cast each message to AIMessage type
  const castedMessages = receivedChat.messages.map(message => message as AIMessage);

  // Return the chat with the casted messages
  return [{
    ...receivedChat,
    messages: castedMessages
  }];
}

export async function getChats(userId?: string | null): Promise<GetChatResult> {
  if (!userId) {
    return []
  }

  try {
    const receivedChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      include: {
        messages: true,  // Include related messages
      }
    })

    // Cast messages in each chat to AIMessage type
    const castedChats = receivedChats.map(chat => ({
      ...chat,
      messages: chat.messages.map(message => message as AIMessage)
    }));

    return castedChats;
  } catch (e) {
    console.error(`getChats error: ${e}`)
    return []
  }
}

export async function saveChat(savedChat: Chat) {
  const user = await getCurrentUser()

  let existingChat = await prisma.chat.findFirst({
    where: {
      id: savedChat.id,
    },
  })

    if (!existingChat) {
      existingChat = await prisma.chat.create({
        data: {
          id: savedChat.id,
          title: savedChat.title,
          userId: savedChat.userId,
          createdAt: savedChat.createdAt,
          path: savedChat.path,
        }
      })
    }
    for (const message of savedChat.messages) {
      await prisma.chatMessage.upsert({
        where: {
          id: message.id,
        },
        update: {
          content: message.content,
          role: message.role,
        },
        create: {
          id: message.id,
          content: message.content,
          role: message.role,
          chatId: savedChat.id,
        }
      })
    }

}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
      .map((key) => (process.env[key] ? '' : key))
      .filter((key) => key !== '')
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: 'UnuserIdized',
    }
  }

  if (user) {
    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!chat) {
      return {
        error: 'Chat not found or unuserIdized',
      }
    }
  }

  await prisma.chat.delete({
    where: {
      id,
    },
  })

  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onSettled: (data, error) => {
      console.log(data, error)
    },
  })
  const query = queryCache.find({ queryKey: ['profiles'] })

  revalidatePath('/')
  return revalidatePath(path)
}

export const clearAllChats = async (userId: string) => {
  const user = await getCurrentUser()
  if (!user || !userId) {
    return {
      error: 'UnuserIdized',
    }
  }

  if (user) {
    const deletedChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
    })

    if (deletedChats.length) {
      await prisma.chat.deleteMany({
        where: {
          userId: userId,
        },
      })
    }
    return revalidatePath(deletedChats.map((chat) => chat.path).join(', '))
  }
}