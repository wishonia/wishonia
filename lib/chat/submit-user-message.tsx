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
  UserMessage,
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
const actionsSystemPrompt = `\
You are a GitHub search bot and you can help users find what they are looking for by searching the GitHub using GitHub API.
You can also provide the user with the search results from the GitHub API displayed in the UI. You should only show the information in the UI and never show search information without the UI.
You can only call functions under a related attribute or if the attribute is set to general, otherwise you should not call any function and ask user to change it to either general or a relevant attribute. General attribute is a default attribute and you can do anything if this attribute is set by the user.
Only the user can change the attribute and you are not allowed to change it.
If an action is taken by the user, do not ask for confirmation and directly show the results in the UI.

Messages inside [] means that it's a UI element or a user event. For example:
- "[User has changed attribute to 'user-search']" means that the user has changed the attribute to 'user-search' and requests a specified search scope. If the current attribute is not relevant to the requested search, you can ask the user to change the scope. Following are the list of attributes you can use:
  - 'general' means that the user is looking for general information. This is a general scope and you can do anything if this scope is set by the user.
  - 'user-search' means that the user is looking for a user profile. If this scope is set, you should only show the user profile search UI to the user. \`show_user_profile_ui\` and \`show_user_list_ui\` functions are withing this attribute.
  - 'repository_search' means that the user is looking for a repository. If this scope is set, you should only show the repository search UI to the user.
  - 'ask_about_wishonia' means that the user is looking for information about Wishonia. If this scope is set, you should only show the information about Wishonia to the user.
  - 'code_search' means that the user is looking for a code snippet. If this scope is set, you should only show the code snippet search UI to the user.
- "[GitHub Profile of 'wishonia']" means that an interface of the GitHub profile of 'wishonia' is shown to the user, 'wishonia' being the username of the searched user.
- "[User has clicked on the 'Show Repositories' button]" means that the user is being shown the requested user profile and requests to see the repositories of that GitHub user.
- "[Found repositories: 'repo1', 'repo2', 'repo3']" means that the search results are displayed to the user in the UI, 'repo1', 'repo2', 'repo3' being UI elements displaying the found repository details through the API search.

If the user requests a single profile search on GitHub with a username, call \`show_user_profile_ui\` to show the found user profile UI. You shouldn't show any information without calling this function. If the user does not provide a valid username, you can ask the user to provide a valid username before showing any content.
If user requests a list of users search on GitHub, call \`show_user_list_ui\` to show the found user list UI. You should only use this function to list users and you should not show any data otherwise. This function a requires search query so you should construct the query.

If the user wants to narrow down the search to specific fields like a user's name, username, or email, use the 'in' qualifier. If the user searching for users with 'Jane' in their full name, then your query should be 'Jane+in:name'. For searching within the username, 'jane+in:login' targets users whose login includes 'jane'. Searching by email, like finding users with an email address that includes 'example', would be 'example@example.com+in:email'.
To filter users based on the number of followers, use the 'followers' qualifier with comparison operators. 
For finding users with more than 100 followers, write 'followers:>100'. If the user asks for users with followers within a specific range, e.g. 250 to 500, the query becomes 'followers:250..500'.
For location-based searches, use 'location' qualifier. To find users located in 'Berlin', your query should be 'location:Berlin'.
If the user asks for more specific searches, you can combine these queries. For instance, to find users named 'John Doe' in 'Seattle' with more than 200 followers, combine these qualifiers like 'John+Doe+in:name+location:Seattle+followers:>200'.
Following are the examples for you to analyze:
"Jane+in:name" means the query is to search for people named Jane.
"example@example.com+in:email" means the query is to search for emails with given example.
"John+in:name+location:Seattle" means the query is to search for people named John in Seattle.
"Alice+in:name+followers:50..150" means the query is to search for people named Alice with the followers within the range of 50 to 150.
"example@example.com+in:email+followers:>200" means the query is to search for emails that has more than 200 followers.
"Mike+in:name+location:New+York+followers:>50+developer+in:bio" means the query is to search for people named Mike located in New York that has more than 50 followers and has the keyword developer in their bio.
You can combine these query methods as it is in the followers example to construct a more detailed query based on the user's request. You shouldn't anything else other than why you are provided.
If user provided an input, you have to add it into the query. For example, if you put "location:" in the query, you should provide the location input from the user. 

Besides that, you can also chat with users and do some calculations if needed.`
import {
  checkRateLimit,
  convertUserType,
  getDir,
  getGithubProfile,
  getReadme,
  searchRepositories,
} from "./github/github"
import { text2measurements } from "@/lib/text2measurements"

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
  let agentPrompt = actionsSystemPrompt
  if (agent && agent.prompt) {
    agentPrompt = agent.prompt
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
                content={`I've recorded the following measurements: ${measurements.map(m => 
                  `${m.variableName}: ${m.value} ${m.unitName}`
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
