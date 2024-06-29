import "server-only"

import { createStreamableUI, getMutableAIState } from "ai/rsc"
import { nanoid } from "nanoid"

import { BotCard } from "@/components/assistant/Message"
import { ProfileSkeleton } from "@/components/assistant/ProfileSkeleton"
import { Readme } from "@/components/assistant/Readme"
import Repositories from "@/components/assistant/Repositories"
import RepositorySkeleton from "@/components/assistant/RepositorySkeleton"
import { Spinner } from "@/components/assistant/Spinner"
import RateLimited from "@/components/RateLimited"

import { Readme as RM } from "../types"
import { runAsyncFnWithoutBlocking, sleep } from "../utils"
import { AI } from "./actions"
import {
  checkRateLimit,
  getDir,
  getReadme,
  searchRepositories,
} from "./github/github"

export async function repoAction(username: string) {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  const loadingRepos = createStreamableUI(
    <BotCard>
      <RepositorySkeleton />
    </BotCard>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    loadingRepos.update(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>
    )
    const rateLimitRemaining = await checkRateLimit()
    const repositories = await searchRepositories(`user:${username}`)

    loadingRepos.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>
    )
    sleep(1000)

    systemMessage.done(
      <BotCard>
        {rateLimitRemaining !== 0 ? (
          <Repositories props={repositories} />
        ) : (
          <RateLimited />
        )}
      </BotCard>
    )

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
        {
          id: nanoid(),
          role: "system",
          content: `[User has clicked on the 'Show Repositories' button]`,
        },
      ],
    })
  })

  return {
    repoUI: loadingRepos.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}

export async function readmeAction(repo: string, owner: string) {
  "use server"

  const aiState = getMutableAIState<typeof AI>()

  const loadingReadme = createStreamableUI(<BotCard>{Spinner}</BotCard>)

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    loadingReadme.update(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>
    )
    const rateLimitRemaining = await checkRateLimit()
    const readme: RM = await getReadme(repo, owner)

    loadingReadme.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>
    )
    sleep(1000)
    systemMessage.done(
      <BotCard>
        {rateLimitRemaining !== 0 ? (
          <Readme props={readme.content} />
        ) : (
          <RateLimited />
        )}
      </BotCard>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "function",
          name: "show_readme_ui",
          content: JSON.stringify(readme.content),
        },
        {
          id: nanoid(),
          role: "system",
          content: `[User has clicked on the 'Show Readme' button]`,
        },
      ],
    })
  })

  return {
    readmeUI: loadingReadme.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}
