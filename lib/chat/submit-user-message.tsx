import "server-only"

import { createStreamableValue, getMutableAIState, render } from "ai/rsc"
import { nanoid } from "nanoid"
import OpenAI from "openai"
import { z } from "zod"

import { askSupabase } from "@/lib/docs/docsAgent"
import { getCurrentUser } from "@/lib/session"
import { Agent } from "@/lib/types"
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from "@/components/assistant/Message"
import { Profile } from "@/components/assistant/Profile"
import { ProfileList } from "@/components/assistant/ProfileList"
import {
  ProfileListSkeleton,
  ProfileSkeleton,
} from "@/components/assistant/ProfileSkeleton"
import { Readme } from "@/components/assistant/Readme"
import ReadmeSkeleton from "@/components/assistant/ReadmeSkeleton"
import Repositories from "@/components/assistant/Repositories"
import RepositorySkeleton from "@/components/assistant/RepositorySkeleton"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import RateLimited from "@/components/RateLimited"

import { cn, sleep } from "../utils"
import { AI } from "./actions"
import { generateSystemPrompt } from './prompt-generator'
import { githubAgent } from './agents/github-agent'
import { fdaAgent } from './agents/fda-agent'
import {
  checkRateLimit,
  convertUserType,
  getGithubProfile,
  getReadme,
  searchRepositories,
} from "./github/github"
import { text2measurements } from "@/lib/text2measurements"
const agentMap = {
  github: githubAgent,
  fda: fdaAgent
} as const

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

type InvokedFunction = {
  name: string;
  parameters: Record<string, unknown>;
}

export async function submitUserMessage(
  content: string,
  agent: Agent,
  attribute: string
) {
  "use server"
  //debugger

  console.log(`submitUserMessage: ${content}`)
  const aiState = getMutableAIState<typeof AI>()

  const newState = aiState.get()
  newState.messages.push({
    id: nanoid(),
    role: "user",
    content,
  })
  aiState.update(newState)

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode
  let agentPrompt
  if (agent?.type && agent.type in agentMap) {
    agentPrompt = generateSystemPrompt(agentMap[agent.type as keyof typeof agentMap])
  } else {
    // Fallback to GitHub agent for backward compatibility
    agentPrompt = generateSystemPrompt(githubAgent)
  }

  const handleGitHubError = (error: any): JSX.Element => {
    if (error.name === 'GitHubAuthError') {
      return (
        <BotCard>
          <BotMessage
            agentName={agent?.name}
            avatar={agent?.avatar}
            content={`I need access to your GitHub account to help with that. Please go to Settings > Connections to connect your GitHub account.`}
          />
          <div className="mt-4">
            <a 
              href="/dashboard/settings/connections"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Connect GitHub Account
            </a>
          </div>
        </BotCard>
      )
    }
    
    return (
      <BotCard>
        <BotMessage
          agentName={agent?.name}
          avatar={agent?.avatar}
          content={`Sorry, there was an error: ${error.message}`}
        />
      </BotCard>
    )
  }

  const ui = render({
    model: "gpt-3.5-turbo",
    provider: openai,
    initial: <SpinnerMessage avatar={agent?.avatar} />,
    messages: [
      {
        role: "system",
        content: agentPrompt,
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta, experimental_invokedFunctions }: { 
      content: string;
      delta: string;
      done: boolean;
      experimental_invokedFunctions?: InvokedFunction[];
    }) => {
      if (done && experimental_invokedFunctions?.length) {
        aiState.update({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "system",
              content: `[Matched actions: ${experimental_invokedFunctions.map((f: InvokedFunction) => f.name).join(", ")}]`,
            }
          ]
        })
      } else if (done && !experimental_invokedFunctions?.length) {
        aiState.update({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "system", 
              content: "[General response - no specific actions matched]"
            }
          ]
        })
      }

      if (!textStream) {
        textStream = createStreamableValue("")
        textNode = (
          <BotMessage
            agentName={agent?.name}
            avatar={agent?.avatar}
            content={textStream.value}
          />
        )
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
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
        description: "Show the found user profile UI",
        parameters: z.object({
          username: z
            .string()
            .describe("The username of the user to search for"),
        }),
        render: async function* ({ username }): AsyncGenerator<JSX.Element, JSX.Element, unknown> {
          try {
            yield (
              <BotCard>
                <ProfileSkeleton />
              </BotCard>
            )
            const rateLimitRemaining = await checkRateLimit()
            const profile = await getGithubProfile(username)
            await sleep(1000)

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "function",
                  name: "show_user_profile_ui",
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
          } catch (error) {
            return handleGitHubError(error)
          }
        },
      },
      show_user_list_ui: {
        description: "Show the found user list UI",
        parameters: z.object({
          query: z.string().describe("The query to search for users"),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <ProfileListSkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const profiles = await convertUserType(query)
          await sleep(1000)
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "show_user_list_ui",
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
        description: "Show the found repositories UI",
        parameters: z.object({
          query: z.string().describe("The query to search for users"),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <RepositorySkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const repositories = await searchRepositories(query)
          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "show_repository_ui",
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
        description: "Show the found problems vote UI",
        parameters: z.object({}),
        render: async function* ({}) {
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
                role: "function",
                name: "show_problems_vote_ui",
                content: JSON.stringify({}),
              },
            ],
          })
          const user = await getCurrentUser()

          return (
            <BotCard>
              <div className={cn("group flex w-full items-start")}>
                <div className="w-full flex-1 space-y-2 overflow-hidden px-1">
                  <PollRandomGlobalProblems
                    user={user}
                  ></PollRandomGlobalProblems>
                </div>
              </div>
            </BotCard>
          )
        },
      },
      show_readme_ui: {
        description: "Show the found Readme.md UI",
        parameters: z.object({
          repo: z.string().describe("The repo to search for"),
          owner: z.string().describe("The owner of the repo"),
        }),
        render: async function* ({ repo, owner }) {
          yield (
            <BotCard>
              <ReadmeSkeleton />
            </BotCard>
          )
          const rateLimitRemaining = await checkRateLimit()
          const response = await getReadme(repo, owner)
          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "show_readme_ui",
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
        description: "Ask a general question about Wishonia or Wishocracy",
        parameters: z.object({
          question: z
            .string()
            .describe("The question to answer about wishonia or wishocracy"),
        }),
        render: async function* ({ question }) {
          yield (
            <BotCard>
              <ReadmeSkeleton />
            </BotCard>
          )
          //const rateLimitRemaining = await checkRateLimit()
          const rateLimitRemaining = true
          if (!rateLimitRemaining) {
            return (
              <BotCard>
                <RateLimited />
              </BotCard>
            )
          }
          const content = await askSupabase(question, false)
          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "ask_about_wishonia",
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
      record_measurement: {
        description: "Record measurements from natural language text",
        parameters: z.object({
          text: z.string().describe("The text containing measurements to record"),
        }),
        render: async function* ({ text }) {
          yield (
            <BotCard>
              <SpinnerMessage avatar={agent?.avatar} />
            </BotCard>
          )
          
          const currentUtcDateTime = new Date().toISOString()
          const timeZoneOffset = new Date().getTimezoneOffset()
          
          const measurements = await text2measurements(text, currentUtcDateTime, timeZoneOffset)
          
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
            ],
          })

          return (
            <BotCard>
              <BotMessage
                agentName={agent?.name}
                avatar={agent?.avatar}
                content={`I've recorded the following measurements: ${measurements.map((m) => 
                  `${m.variableName}: ${m.value}${m.unitName ? ` ${m.unitName}` : ''}`
                ).join(', ')}`}
              />
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
