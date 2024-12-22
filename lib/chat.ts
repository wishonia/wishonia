import { prisma } from "@/lib/db"
import { textCompletion } from "@/lib/llm"
import type { ChatWithMessagesAndAgent } from "@/lib/types"
import { getRedisModelCache } from "@/lib/utils/redis"

// Local implementation of document type
interface Document {
  pageContent: string
  metadata: Record<string, any>
}

interface ChatMessage {
  type: "human" | "ai"
  text: string
}

interface ChatResponse {
  text: string
  sourceDocuments: Document[]
}

async function createNewChat(chat: ChatWithMessagesAndAgent) {
  try {
    const createdChat = await prisma.chat.create({
      data: {
        id: chat.id,
        title: chat.title,
        userId: chat.userId,
        createdAt: chat.createdAt,
        path: chat.path,
        agentId: chat.agent?.id,
      },
    })
    await createChatMessages(chat.messages, createdChat.id)
    return createdChat
  } catch (error) {
    console.error(
      `createNewChat error: ${error}. could not create chat with params: `,
      chat
    )
    throw error
  }
}

async function getExistingMessageIds(chatId: string) {
  return (
    await prisma.chatMessage.findMany({
      where: {
        chatId,
      },
      select: {
        id: true,
      },
    })
  ).map((m: { id: string }) => m.id)
}

async function createChatMessages(messages: ChatWithMessagesAndAgent["messages"], chatId: string) {
  for (const message of messages) {
    const chatMessage = JSON.parse(JSON.stringify(message))
    chatMessage.chatId = chatId

    try {
      await prisma.chatMessage.create({
        data: chatMessage,
      })
    } catch (error) {
      console.error(
        `createChatMessages error: ${error} for chatMessage: `,
        chatMessage
      )
    }
  }
}

export async function saveChat(chat: ChatWithMessagesAndAgent) {
  const existingChat = await prisma.chat.findFirst({
    where: {
      id: chat.id,
      userId: chat.userId,
    },
  })

  if (!existingChat) {
    await createNewChat(chat)
  } else {
    const existingMessageIds = await getExistingMessageIds(existingChat.id)
    const newMessages = chat.messages.filter(
      (message) => !existingMessageIds.includes(message.id)
    )

    await createChatMessages(newMessages, existingChat.id)
  }
}

export const formatDocumentsAsString = (documents: Document[]): string =>
  documents.map((doc) => doc.pageContent).join("\n\n")

// Helper function to format chat history
function formatChatHistory(history: ChatMessage[]): string {
  return history
    .map((msg) => `${msg.type === "human" ? "Human" : "Assistant"}: ${msg.text}`)
    .join("\n")
}

export async function processChatRequest(
  message: string,
  history: ChatMessage[],
  agentId: string
): Promise<ChatResponse> {
  const agent = await prisma.agent.findFirst({
    where: {
      id: agentId,
    },
  })
  if (!agent) {
    throw new Error(`Agent with id ${agentId} not found`)
  }

  const datasources = await prisma.agentDatasource.findMany({
    where: {
      agentId: agentId,
    },
    select: {
      datasourceId: true,
    },
  })
  const datasourceId = datasources[0].datasourceId
  const sanitizedQuestion = message.trim().replaceAll("\n", " ")

  // Get relevant documents from vector store
  const cache = getRedisModelCache()
  const cacheKey = `docs:${datasourceId}:${sanitizedQuestion}`
  let relevantDocs: Document[] = []
  
  const cachedDocs = await cache.lookup(cacheKey)
  if (cachedDocs) {
    relevantDocs = JSON.parse(cachedDocs)
  } else {
    // Here you would implement your vector search
    // For now returning empty array
    relevantDocs = []
    await cache.update(cacheKey, JSON.stringify(relevantDocs))
  }

  // Format context from documents
  const context = formatDocumentsAsString(relevantDocs)
  
  // Format chat history
  const formattedHistory = formatChatHistory(history)

  // Create prompt with context, history and question
  const prompt = `
Context:
${context}

Chat History:
${formattedHistory}

Question: ${sanitizedQuestion}

Please provide a helpful response based on the context and chat history above.
`

  // Get response from LLM
  const response = await textCompletion(prompt, "text")

  return {
    text: response,
    sourceDocuments: relevantDocs
  }
}
