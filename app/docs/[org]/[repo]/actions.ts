"use server"

import { Octokit } from "@octokit/rest"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { getGithubAccessToken } from "@/lib/getOauthAccessToken"

export type RepoContent = {
  path: string
  type: "file" | "dir"
  name: string
  content?: string
  children?: RepoContent[]
}

const RATE_LIMIT_THRESHOLD = 100 // Minimum remaining calls before we start warning

async function checkRateLimitBeforeRequest() {
  const rateLimit = await getGithubRateLimit()
  if (!rateLimit) return true // If we can't check rate limit, proceed anyway

  if (rateLimit.remaining < RATE_LIMIT_THRESHOLD) {
    throw new Error(
      `GitHub API rate limit is too low (${rateLimit.remaining} remaining). Please try again later.`
    )
  }

  return true
}

export async function getGithubContent(
  org: string,
  repo: string,
  path: string
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const githubToken = await getGithubAccessToken(session.user.id)
    if (!githubToken) {
      throw new Error("No GitHub token available")
    }

    await checkRateLimitBeforeRequest()

    console.log(`Fetching content for ${org}/${repo}/${path}...`)
    const octokit = new Octokit({
      auth: githubToken,
      retry: {
        enabled: true,
        retries: 3,
      },
    })

    const response = await octokit.repos
      .getContent({
        owner: org,
        repo,
        path,
      })
      .catch((error) => {
        console.error(`GitHub API error for ${path}:`, error.message)
        throw new Error(`Failed to fetch ${path}: ${error.message}`)
      })

    if (
      "content" in response.data &&
      typeof response.data.content === "string"
    ) {
      return Buffer.from(response.data.content, "base64").toString()
    } else {
      console.error(`Invalid content format for ${path}:`, response.data)
      throw new Error(`Invalid content format for ${path}`)
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("rate limit")) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.")
    }
    console.error("GitHub content error:", error)
    throw error
  }
}

export async function getRepoContents(
  org: string,
  repo: string,
  path: string = ""
): Promise<RepoContent[]> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const githubToken = await getGithubAccessToken(session.user.id)
    if (!githubToken) {
      throw new Error("No GitHub token available")
    }

    const octokit = new Octokit({
      auth: githubToken,
    })

    const response = await octokit.repos.getContent({
      owner: org,
      repo,
      path,
    })

    const contents = Array.isArray(response.data)
      ? response.data
      : [response.data]

    const processedContents: RepoContent[] = await Promise.all(
      contents.map(async (item: any) => {
        const result: RepoContent = {
          path: item.path,
          type: item.type,
          name: item.name,
        }

        if (item.type === "dir") {
          result.children = await getRepoContents(org, repo, item.path)
        }

        return result
      })
    )

    return processedContents
  } catch (error) {
    console.error("Error fetching repo contents:", error)
    return []
  }
}

export async function checkGithubAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { hasAccess: false, error: "No session" }
  }

  try {
    const githubToken = await getGithubAccessToken(session.user.id)
    return {
      hasAccess: !!githubToken,
      error: githubToken ? null : "No GitHub token available",
    }
  } catch (error) {
    return {
      hasAccess: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check GitHub access",
    }
  }
}

export async function getImageMetadata(
  org: string,
  repo: string,
  path: string
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const githubToken = await getGithubAccessToken(session.user.id)
    if (!githubToken) {
      throw new Error("No GitHub token available")
    }

    const octokit = new Octokit({
      auth: githubToken,
    })

    const response = await octokit.repos.getContent({
      owner: org,
      repo,
      path,
    })

    if (
      "content" in response.data &&
      typeof response.data.content === "string"
    ) {
      return {
        url: response.data.download_url,
        size: response.data.size,
        type: response.data.type,
      }
    }

    throw new Error("Invalid image metadata")
  } catch (error) {
    console.error("GitHub image metadata error:", error)
    throw error
  }
}

let rateLimitCache: {
  data: any
  timestamp: number
} | null = null

const RATE_LIMIT_CACHE_DURATION = 30000 // 30 seconds

export async function getGithubRateLimit() {
  try {
    // Check memory cache
    if (
      rateLimitCache &&
      Date.now() - rateLimitCache.timestamp < RATE_LIMIT_CACHE_DURATION
    ) {
      return rateLimitCache.data
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const githubToken = await getGithubAccessToken(session.user.id)
    if (!githubToken) {
      return null
    }

    const octokit = new Octokit({
      auth: githubToken,
    })

    const { data } = await octokit.rateLimit.get()

    const rateLimit = {
      remaining: data.rate.remaining,
      limit: data.rate.limit,
      reset: new Date(data.rate.reset * 1000),
      used: data.rate.used,
    }

    // Update cache
    rateLimitCache = {
      data: rateLimit,
      timestamp: Date.now(),
    }

    return rateLimit
  } catch (error) {
    console.error("Error fetching rate limit:", error)
    return null
  }
}