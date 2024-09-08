"use server"

import { revalidatePath } from "next/cache"
import { QueryCache } from "@tanstack/react-query"
import { type Message as AIMessage } from "ai"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { type Chat } from "@/lib/types"
import {
  ArticleWithRelations,
  findArticleByTopic,
  writeArticle
} from "@/lib/agents/researcher/researcher"
type GetChatResult = Chat[] | null
type SetChatResults = Chat[]
import OpenAI from 'openai'
import {Article} from "@prisma/client";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
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
    (message) => message as AIMessage
  )

  // Return the chat with the casted messages
  return [
    {
      ...receivedChat,
      messages: castedMessages,
    },
  ]
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
        messages: true, // Include related messages
        agent: true, // Include related messages
      },
    })

    // Cast messages in each chat to AIMessage type
    const castedChats = receivedChats.map((chat) => ({
      ...chat,
      messages: chat.messages.map((message) => message as AIMessage),
    }))

    return castedChats
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
      error: "UnuserIdized",
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
        error: "Chat not found or unuserIdized",
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
            in: deletedChats.map((chat) => chat.id),
          },
        },
      })
      await prisma.chat.deleteMany({
        where: {
          userId: userId,
        },
      })
    }
    return revalidatePath(deletedChats.map((chat) => chat.path).join(", "))
  }
}

export async function writeArticleAction(topic: string): Promise<ArticleWithRelations> {

  let article: ArticleWithRelations | null

  article = await findArticleByTopic(topic)
  if(!article) {
    article = await writeArticle(topic)
  }

  revalidatePath('/')
  return article
}

export async function generateImage(topic: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create an image representing the topic: ${topic}`,
      n: 1,
      size: "1024x1024",
    })

    const imageUrl = response.data[0].url

    revalidatePath('/')
    return imageUrl
  } catch (error) {
    console.error('Error generating image:', error)
    throw new Error('Failed to generate image')
  }
}