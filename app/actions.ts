"use server"

import { revalidatePath } from "next/cache"
import { QueryCache } from "@tanstack/react-query"
import { Message } from "ai"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import type { Chat, ChatMessage, Agent } from "@prisma/client"

type SetChatResults = (Chat & { messages: ChatMessage[]; agent: Agent | null })[]

export async function getChat(
  id: string,
  loggedInUserId: string
): Promise<SetChatResults> {
  const receivedChat = await prisma.chat.findFirst({
    where: {
      id,
      userId: loggedInUserId,
    },
    include: {
      messages: true,
      agent: true,
    },
  })

  if (!receivedChat) {
    return []
  }

  // Cast each message to AIMessage type
  const castedMessages = receivedChat.messages.map(
    (message: ChatMessage) => message
  )

  // Return the chat with the casted messages
  return [
    {
      ...receivedChat,
      messages: castedMessages,
    },
  ]
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const receivedChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      include: {
        //messages: true, // Include related messages
        //agent: true, // Include related messages
      },
    })


    return receivedChats
  } catch (e) {
    console.error(`getChats error: ${e}`)
    return []
  }
}

export async function getMissingKeys() {
  const keysRequired = ["OPENAI_API_KEY"]
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "")
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Please sign in",
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
        error: "Chat not found!",
      }
    }
  }

  // Delete associated chat messages first
  await prisma.chatMessage.deleteMany({
    where: {
      chatId: id,
    },
  })

  // Then delete the chat
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
  const query = queryCache.find({ queryKey: ["profiles"] })

  revalidatePath("/")
  return revalidatePath(path)
}

export const clearAllChats = async (userId: string) => {
  const user = await getCurrentUser()
  if (!user || !userId) {
    return {
      error: "Unauthorized",
    }
  }

  if (user) {
    const deletedChats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
    })

    if (deletedChats.length) {
      await prisma.chatMessage.deleteMany({
        where: {
          chatId: {
            in: deletedChats.map((chat: Chat) => chat.id),
          },
        },
      })
      await prisma.chat.deleteMany({
        where: {
          userId: userId,
        },
      })
    }
    return revalidatePath(deletedChats.map((chat: Chat) => chat.path).join(", "))
  }
}
