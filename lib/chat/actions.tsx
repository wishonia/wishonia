import "server-only"

import { Message } from "ai"
import { createAI, getAIState, getMutableAIState } from "ai/rsc"

import { saveChat } from "@/lib/chat"
import { getCurrentUser } from "@/lib/session"
import {
  BotCard,
  BotMessage,
  UserMessage,
} from "@/components/assistant/Message"
import { Profile } from "@/components/assistant/Profile"
import { ProfileList } from "@/components/assistant/ProfileList"
import { Readme } from "@/components/assistant/Readme"
import Repositories from "@/components/assistant/Repositories"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import { text2measurements } from "@/lib/text2measurements"

import { Chat } from "../types"
import { nanoid } from "../utils"
import { readmeAction, repoAction } from "./submit-user-action"
import { submitUserMessage } from "./submit-user-message"

export type AIState = {
  chatId: string
  messages: {
    role: "user" | "assistant" | "system" | "function" | "data" | "tool"
    content: string
    id: string
    name?: string
  }[]
  agent?: {
    id: string
    name: string
    userId?: string
    prompt?: string | null
    conversationStarters?: string[] | null
    avatar?: string | null
  } | null
  measurements?: {
    variableName: string
    value: number
    unitName: string
  }[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export async function recordMeasurement(content: string) {
  "use server"
  
  const aiState = getMutableAIState<typeof AI>()
  const currentUtcDateTime = new Date().toISOString()
  const timeZoneOffset = new Date().getTimezoneOffset()
  
  const measurements = await text2measurements(content, currentUtcDateTime, timeZoneOffset)
  
  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "function",
        name: "record_measurement",
        content: JSON.stringify(measurements),
      },
      {
        id: nanoid(),
        role: "system",
        content: `[Measurements recorded: ${measurements.map(m => `${m.variableName}: ${m.value} ${m.unitName}`).join(', ')}]`,
      },
    ],
  })

  return {
    id: nanoid(),
    display: (
      <BotCard>
        <BotMessage
          content={`I've recorded the following measurements: ${measurements.map(m => `${m.variableName}: ${m.value} ${m.unitName}`).join(', ')}`}
        />
      </BotCard>
    ),
  }
}

export const AI = createAI<AIState, UIState>({
  actions: { submitUserMessage, repoAction, readmeAction, recordMeasurement },
  initialAIState: {
    chatId: nanoid(),
    messages: [],
  },
  initialUIState: [],

  onGetUIState: async () => {
    "use server"

    const user = await getCurrentUser()

    if (user) {
      const aiState = getAIState()
      if (aiState) {
        return getUIStateFromAIState(aiState as Chat)
      }
    } else {
      return
    }
  },

  onSetAIState: async ({ state }) => {
    "use server"

    const user = await getCurrentUser()
    const { chatId, messages, agent } = state
    if (user) {
      //debugger

      const createdAt = new Date()
      const userId = user.id as string
      const path = `/chat/${chatId}`
      const title = messages[1].content.substring(0, 100)

      const savedChat: Chat = {
        id: chatId,
        title: title,
        userId: userId,
        createdAt: createdAt,
        messages: messages,
        path: path,
        agent: agent,
      }

      await saveChat(savedChat)
    } else {
      console.log(`unstable_onSetAIState: not authenticated`)
      return
    }
  },
})

// Parses the previously rendered content and returns the UI state.
// (Useful for chat history to rerender the UI components again when switching between the chats)
export const getUIStateFromAIState = async (aiState: Chat) => {
  const user = await getCurrentUser()
  return aiState.messages
    .filter((message: Message) => message.role !== "system")
    .map((m: Message, index: number) => ({
      id: `${aiState.id}-${index}`,
      display:
        m.role === "function" ? (
          m.name === "show_user_profile_ui" ? (
            <BotCard>
              <Profile props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === "show_user_list_ui" ? (
            <BotCard>
              <ProfileList props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === "show_repository_ui" ? (
            <BotCard>
              <Repositories props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === "ask_about_wishonia" ? (
            <BotCard>
              <div>m.content</div>
            </BotCard>
          ) : m.name === "show_readme_ui" ? (
            <BotCard>
              <Readme props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === "problems_vote_ui" ? (
            <BotCard>
              <PollRandomGlobalProblems user={user}></PollRandomGlobalProblems>
            </BotCard>
          ) : m.name === "record_measurement" ? (
            <BotCard>
              <BotMessage
                content={`Recorded measurements: ${JSON.parse(m.content).map((measurement: any) => 
                  `${measurement.variableName}: ${measurement.value} ${measurement.unitName}`
                ).join(', ')}`}
              />
            </BotCard>
          ) : null
        ) : m.role === "user" ? (
          <UserMessage>{m.content}</UserMessage>
        ) : (
          <BotMessage
            avatar={aiState.agent?.avatar}
            agentName={aiState.agent?.name || m.name}
            content={m.content}
          />
        ),
    }))
}
