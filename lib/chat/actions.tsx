import 'server-only'

import {BotCard, BotMessage, UserMessage,} from '@/components/assistant/Message'
import {Chat} from '../types'
import {saveChat} from '@/lib/chat'
import {getCurrentUser} from '@/lib/session'
import {createAI, getAIState} from 'ai/rsc'
import {Readme} from '@/components/assistant/Readme'
import {Profile} from '@/components/assistant/Profile'
import {submitUserMessage} from './submit-user-message'
import {nanoid} from '../utils'
import Repositories from '@/components/assistant/Repositories'
import {ProfileList} from '@/components/assistant/ProfileList'
import {readmeAction, repoAction} from './submit-user-action'
import {PollRandomGlobalProblems} from "@/components/poll-random-global-problems";
import {Message} from "ai";

export type AIState = {
  chatId: string
  messages: {
    role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
    content: string
    id: string
    name?: string
  }[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: { submitUserMessage, repoAction, readmeAction },
  initialAIState: {
    chatId: nanoid(),
    messages: [],
  },
  initialUIState: [],

  onGetUIState: async () => {
    'use server'

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
    'use server'

    const user = await getCurrentUser()
      const { chatId, messages } = state

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
      .filter((message: Message) => message.role !== 'system')
      .map((m: Message, index: number) => ({
        id: `${aiState.id}-${index}`,
        display:
            m.role === 'function' ? (
                m.name === 'show_user_profile_ui' ? (
                    <BotCard>
                      <Profile props={JSON.parse(m.content)} />
                    </BotCard>
                ) : m.name === 'show_user_list_ui' ? (
                    <BotCard>
                      <ProfileList props={JSON.parse(m.content)} />
                    </BotCard>
                ) : m.name === 'show_repository_ui' ? (
                    <BotCard>
                      <Repositories props={JSON.parse(m.content)} />
                    </BotCard>
                ) : m.name === 'ask_about_wishonia' ? (
                    <BotCard>
                        <div>m.content</div>
                    </BotCard>
                ) : m.name === 'show_readme_ui' ? (
                    <BotCard>
                      <Readme props={JSON.parse(m.content)} />
                    </BotCard>
                ) : m.name === 'problems_vote_ui' ? (
                    <BotCard>
                        <PollRandomGlobalProblems user={user}>
                        </PollRandomGlobalProblems>
                    </BotCard>
                ) : null
            ) : m.role === 'user' ? (
                <UserMessage>{m.content}</UserMessage>
            ) : (
                <BotMessage agentName={m.name} content={m.content} />
            ),
      }))
}
