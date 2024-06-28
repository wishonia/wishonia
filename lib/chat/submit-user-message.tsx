import 'server-only'

import {
  checkRateLimit,
  convertUserType,
  getDir,
  getGithubProfile,
  getReadme,
  searchRepositories,
} from './github/github'
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from '@/components/assistant/Message'
import { z } from 'zod'
import OpenAI from 'openai'
import { AI } from './actions'
import { nanoid } from 'nanoid'
import { githubSystemPrompt } from './github-system-prompt'
import { Profile } from '@/components/assistant/Profile'
import Repositories from '@/components/assistant/Repositories'
import { ProfileList } from '@/components/assistant/ProfileList'
import {
  ProfileListSkeleton,
  ProfileSkeleton,
} from '@/components/assistant/ProfileSkeleton'
import { createStreamableValue, getMutableAIState, render } from 'ai/rsc'
import { Readme } from '@/components/assistant/Readme'
import RateLimited from '@/components/RateLimited'
import {cn, sleep} from '../utils'
import RepositorySkeleton from '@/components/assistant/RepositorySkeleton'
import ReadmeSkeleton from '@/components/assistant/ReadmeSkeleton'
import {askSupabase} from "@/lib/docs/docsAgent";
import {PollRandomGlobalProblems} from "@/components/poll-random-global-problems";
import {getCurrentUser} from "@/lib/session";
import { prisma } from "@/lib/db";
import {Agent} from "@/lib/types";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function submitUserMessage(
    content: string,agent:Agent, attribute: string, )
{
  'use server'
  //debugger

  console.log(`submitUserMessage: ${content}`);
  const aiState = getMutableAIState<typeof AI>()

  const newState = aiState.get();
  newState.messages.push({
    id: nanoid(),
    role: 'user',
    content,
  });
  aiState.update(newState)

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode
  let agentPrompt=githubSystemPrompt;
  if(agent && agent.prompt){
      agentPrompt=agent.prompt;
  }

  
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage avatar={agent?.avatar}/>,
    messages: [
      {
        role: 'system',
        content: agentPrompt,
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage agentName={agent?.name} avatar={agent?.avatar} content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content,
            },
          ],
        })
      } else {
        textStream.update(delta)
      }
      return textNode
    },

    functions: {
      show_user_profile_ui: {
        description: 'Show the found user profile UI',
        parameters: z.object({
          username: z
            .string()
            .describe('The username of the user to search for'),
        }),
        render: async function* ({ username }) {
          yield (
            <BotCard>
              <ProfileSkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const profile = await getGithubProfile(username)
          sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_user_profile_ui',
                content: JSON.stringify(profile),
              },
            ],
          })

          return (
            <BotCard>
              {rateLimitRemaining !== 0 ? (
                <Profile props={profile} />
              ) : (
                <RateLimited />
              )}
            </BotCard>
          )
        },
      },
      show_user_list_ui: {
        description: 'Show the found user list UI',
        parameters: z.object({
          query: z.string().describe('The query to search for users'),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <ProfileListSkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const profiles = await convertUserType(query)
          sleep(1000)
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_user_list_ui',
                content: JSON.stringify(profiles),
              },
            ],
          })
          return (
            <BotCard>
              {rateLimitRemaining !== 0 ? (
                <ProfileList props={profiles} />
              ) : (
                <RateLimited />
              )}
            </BotCard>
          )
        },
      },
      show_repository_ui: {
        description: 'Show the found repositories UI',
        parameters: z.object({
          query: z.string().describe('The query to search for users'),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <RepositorySkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const repositories = await searchRepositories(query)
          sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_repository_ui',
                content: JSON.stringify(repositories),
              },
            ],
          })

          return (
            <BotCard>
              {rateLimitRemaining !== 0 ? (
                <Repositories props={repositories} />
              ) : (
                <RateLimited />
              )}
            </BotCard>
          )
        },
      },
      show_problems_vote_ui: {
        description: 'Show the found problems vote UI',
        parameters: z.object({}),
        render: async function* ({  }) {
          console.log("show_problems_vote_ui called")
          yield (
              <BotCard>
                <ReadmeSkeleton />
              </BotCard>
          )

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_problems_vote_ui',
                content: JSON.stringify({}),
              },
            ],
          })
          const user = await getCurrentUser()

          return (
              <BotCard>
                <div className={cn('group flex items-start w-full')}>
                  <div className='flex-1 space-y-2 overflow-hidden px-1 w-full'>
                    <PollRandomGlobalProblems user={user}></PollRandomGlobalProblems>
                  </div>
                </div>
              </BotCard>
          )
        },
      },
      show_readme_ui: {
        description: 'Show the found Readme.md UI',
        parameters: z.object({
          repo: z.string().describe('The repo to search for'),
          owner: z.string().describe('The owner of the repo'),
        }),
        render: async function* ({ repo, owner }) {
          yield (
            <BotCard>
              <ReadmeSkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const response = await getReadme(repo, owner)
          sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_readme_ui',
                content: JSON.stringify(response.content),
              },
            ],
          })

          return (
            <BotCard>
              {rateLimitRemaining !== 0 ? (
                <Readme props={response.content} />
              ) : (
                <RateLimited />
              )}
            </BotCard>
          )
        },
      },
      ask_about_wishonia: {
        description: 'Ask a general question about Wishonia or Wishocracy',
        parameters: z.object({
          question: z.string().describe('The question to answer about wishonia or wishocracy'),
        }),
        render: async function* ({ question }) {
          yield (
              <BotCard>
                <ReadmeSkeleton />
              </BotCard>
          )
          //const rateLimitRemaining = await checkRateLimit()
          const rateLimitRemaining = true;
          if(!rateLimitRemaining){
            return (
                <BotCard>
                  <RateLimited />
                </BotCard>
            )
          }
          const content = await askSupabase(question, false)
          sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'ask_about_wishonia',
                content: content,
              },
            ],
          })

          return (
              <BotCard>
                <Readme props={content} />
              </BotCard>
          )
        },
      },
    },
  })

  return {
    id: nanoid(),
    display: ui,
  }
}
