import { StringOutputParser } from "@langchain/core/output_parsers"
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts"
import {
  RunnableMap,
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { OpenAIEmbeddings } from "@langchain/openai"
import { Document } from "langchain/document"
import { pull } from "langchain/hub"

import { prisma } from "@/lib/db"
import { getChatOpenAIModel } from "@/lib/openai"
import type { Chat } from "@/lib/types"
import { WishoniaVectorStore } from "@/lib/utils/vectorStore"

import { createChain, groupMessagesByConversation } from "./chain"

async function createNewChat(chat: Chat) {
  try {
    const createdChat = await prisma.chat.create({
      data: {
        id: chat.id,
        title: chat.title,
        userId: chat.userId,
        createdAt: chat.createdAt,
        path: chat.path,
        agentId:chat.agent?.id
      },
    })
    await createChatMessages(chat.messages, createdChat.id)
    return createdChat
  } catch (error) {
    debugger
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
  ).map((m) => m.id)
}

async function createChatMessages(messages: Chat["messages"], chatId: string) {
  for (const message of messages) {
    const chatMessage = JSON.parse(JSON.stringify(message))
    chatMessage.chatId = chatId

    try {
      await prisma.chatMessage.create({
        data: chatMessage,
      })
    } catch (error) {
      debugger
      console.error(
        `createChatMessages error: ${error} for chatMessage: `,
        chatMessage
      )
    }
  }
}

export async function saveChat(chat: Chat) {
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

interface ChatMessage {
  type: "human" | "ai"
  text: string
}

interface ChatResponse {
  text: string
  sourceDocuments: Document[]
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

  const vectorstore = await WishoniaVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      //agentId: agent.id,
      datasourceId: datasourceId,
    }
  )
  const retriever = vectorstore.asRetriever()

  if (!agent.prompt) {
    throw new Error(`Agent with id ${agentId} does not have a prompt`)
  }

  const chain = createChain({
    llm: getChatOpenAIModel(),
    question_llm: getChatOpenAIModel(),
    question_template: agent.prompt,
    response_template: agent.prompt,
    retriever,
  })

  const documents = await chain.invoke({
    question: sanitizedQuestion,
    chat_history: groupMessagesByConversation(
      history.map((message) => ({
        type: message.type,
        content: message.text,
      }))
    ),
    DocumentOutputParser: StringOutputParser,
  })
  const agentResponse = await chain.invoke({
    question: "What is task decomposition?",
    context: documents,
  })
  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt")
  const llm = getChatOpenAIModel()

  const ragChainWithSources = RunnableMap.from({
    // Return raw documents here for now since we want to return them at
    // the end - we'll format in the next step of the chain
    context: retriever,
    question: new RunnablePassthrough(),
  }).assign({
    answer: RunnableSequence.from([
      (input) => {
        return {
          // Now we format the documents as strings for the prompt
          context: formatDocumentsAsString(input.context as Document[]),
          question: input.question,
        }
      },
      prompt,
      llm,
      new StringOutputParser(),
    ]),
  })

  return await ragChainWithSources.invoke(message)
}
