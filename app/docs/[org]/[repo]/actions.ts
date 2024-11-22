"use server"

import { Octokit } from "@octokit/rest"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { getGithubAccessToken } from "@/lib/getOauthAccessToken"

import { getCachedData } from "./lib/cache"

export type RepoContent = {
  path: string
  type: "file" | "dir"
  name: string
  content?: string
  children?: RepoContent[]
}

const RATE_LIMIT_THRESHOLD = 100 // Minimum remaining calls before we start warning

interface GithubRequestLog {
  endpoint: string
  timestamp: Date
  rateLimit?: {
    remaining: number
    limit: number
  }
}

let requestLogs: GithubRequestLog[] = []

async function logGithubRequest(octokit: Octokit, endpoint: string) {
  const rateLimit = await octokit.rateLimit.get().catch(() => null)
  const log: GithubRequestLog = {
    endpoint,
    timestamp: new Date(),
    rateLimit: rateLimit
      ? {
          remaining: rateLimit.data.rate.remaining,
          limit: rateLimit.data.rate.limit,
        }
      : undefined,
  }

  requestLogs.push(log)
  console.log(`GitHub Request: ${endpoint}`, log)

  // Keep only last 100 requests in memory
  if (requestLogs.length > 100) {
    requestLogs = requestLogs.slice(-100)
  }
}

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

    const cacheKey = `github:content:${org}:${repo}:${path}`

    return getCachedData(cacheKey, async () => {
      await checkRateLimitBeforeRequest()

      console.log(`Cache miss - Fetching content for ${org}/${repo}/${path}...`)
      const octokit = new Octokit({
        auth: githubToken,
        retry: {
          enabled: true,
          retries: 3,
        },
      })

      await logGithubRequest(
        octokit,
        `GET /repos/${org}/${repo}/contents/${path}`
      )

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
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("rate limit")) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.")
    }
    console.error("GitHub content error:", error)
    throw error
  }
}

// Add a helper function to filter relevant documentation files
function isDocFile(path: string): boolean {
  // Add or modify extensions based on what you want to include
  const validExtensions = [".md", ".mdx"]
  const excludedPaths = [".git", "node_modules"]

  const extension = path.substring(path.lastIndexOf("."))
  const isExcluded = excludedPaths.some((excluded) => path.includes(excluded))

  return validExtensions.includes(extension) && !isExcluded
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

    const cacheKey = `github:tree:${org}:${repo}`

    return getCachedData(cacheKey, async () => {
      await checkRateLimitBeforeRequest()

      const octokit = new Octokit({
        auth: githubToken,
        retry: {
          enabled: true,
          retries: 3,
        },
      })

      // First, get the default branch
      const { data: repoData } = await octokit.repos.get({
        owner: org,
        repo,
      })
      const defaultBranch = repoData.default_branch

      // Get the tree with recursive flag
      await logGithubRequest(
        octokit,
        `GET /repos/${org}/${repo}/git/trees/${defaultBranch}?recursive=1`
      )

      const { data: treeData } = await octokit.git.getTree({
        owner: org,
        repo,
        tree_sha: defaultBranch,
        recursive: "1",
      })

      // Convert flat tree to hierarchical structure
      const root: { [key: string]: RepoContent } = {}

      // First pass: create all directories and files
      treeData.tree
        .filter((item) => {
          // Skip items without paths
          if (!item.path) return false

          if (item.type === "blob") {
            return isDocFile(item.path)
          }
          return item.type === "tree"
        })
        .forEach((item) => {
          // We can safely assert path exists because we filtered out undefined paths
          const itemPath = item.path!
          const parts = itemPath.split("/")
          let currentPath = ""

          parts.forEach((part, index) => {
            const parentPath = currentPath
            currentPath = currentPath ? `${currentPath}/${part}` : part

            if (!root[currentPath]) {
              root[currentPath] = {
                path: currentPath,
                name: part,
                type:
                  item.type === "tree" || index < parts.length - 1
                    ? "dir"
                    : "file",
                children:
                  item.type === "tree" || index < parts.length - 1
                    ? []
                    : undefined,
              }

              if (parentPath && root[parentPath]) {
                root[parentPath].children?.push(root[currentPath])
              }
            }
          })
        })

      // Convert to array and sort
      const result = Object.values(root)
        .filter((item) => !item.path.includes("/")) // Get only root level items
        .sort((a, b) => {
          // Sort directories first, then files
          if (a.type === "dir" && b.type === "file") return -1
          if (a.type === "file" && b.type === "dir") return 1
          // Sort alphabetically within same type
          return a.name.localeCompare(b.name)
        })

      // Remove empty directories
      const filterEmptyDirs = (items: RepoContent[]): RepoContent[] => {
        return items.filter((item) => {
          if (item.type === "dir" && item.children) {
            item.children = filterEmptyDirs(item.children)
            return item.children.length > 0
          }
          return true
        })
      }

      return filterEmptyDirs(result)
    })
  } catch (error) {
    console.error("Error fetching repo contents:", error)
    throw error
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

export async function getGithubRequestLogs(): Promise<GithubRequestLog[]> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }
  return requestLogs
}

interface DetailedRateLimit {
  resources: {
    core: {
      limit: number
      used: number
      remaining: number
      reset: Date
    }
    search: {
      limit: number
      used: number
      remaining: number
      reset: Date
    }
    graphql: {
      limit: number
      used: number
      remaining: number
      reset: Date
    }
  }
}

export async function getDetailedRateLimit(): Promise<DetailedRateLimit | null> {
  try {
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

    // Add null checks for graphql resource
    const graphql = data.resources.graphql ?? {
      limit: 0,
      used: 0,
      remaining: 0,
      reset: 0,
    }

    return {
      resources: {
        core: {
          limit: data.resources.core.limit,
          used: data.resources.core.used,
          remaining: data.resources.core.remaining,
          reset: new Date(data.resources.core.reset * 1000),
        },
        search: {
          limit: data.resources.search.limit,
          used: data.resources.search.used,
          remaining: data.resources.search.remaining,
          reset: new Date(data.resources.search.reset * 1000),
        },
        graphql: {
          limit: graphql.limit,
          used: graphql.used,
          remaining: graphql.remaining,
          reset: new Date(graphql.reset * 1000),
        },
      },
    }
  } catch (error) {
    console.error("Error fetching detailed rate limit:", error)
    return null
  }
}

// Add this new type near the top with other types
export interface SearchResult {
  title: string
  path: string
  excerpt: string
  score: number
}

// Add this new function
export async function searchRepoContent(
  org: string,
  repo: string,
  query: string
): Promise<SearchResult[]> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const githubToken = await getGithubAccessToken(session.user.id)
    if (!githubToken) {
      throw new Error("No GitHub token available")
    }

    const cacheKey = `github:search:${org}:${repo}:${query}`
    const SEARCH_CACHE_TTL = 60 * 60 // Cache search results for 1 hour

    return getCachedData(
      cacheKey,
      async () => {
        await checkRateLimitBeforeRequest()

        const octokit = new Octokit({
          auth: githubToken,
        })

        await logGithubRequest(
          octokit,
          `GET /search/code q=${query}+repo:${org}/${repo}`
        )

        const { data } = await octokit.rest.search.code({
          q: `${query} repo:${org}/${repo} extension:md`,
          per_page: 10,
        })

        const results: SearchResult[] = await Promise.all(
          data.items.map(async (item) => {
            // Get the file content to extract title and excerpt
            const content = await getGithubContent(org, repo, item.path)
            const lines = content.split("\n")

            // Try to find the title from frontmatter or first heading
            const titleMatch =
              content.match(/^#\s+(.+)$/m) ||
              content.match(/title:\s*["'](.+)["']/m)
            const title = titleMatch ? titleMatch[1] : item.path

            // Find the matching context for the excerpt
            const lowerQuery = query.toLowerCase()
            const matchingLine =
              lines.find((line) => line.toLowerCase().includes(lowerQuery)) ||
              ""

            return {
              title,
              path: item.path,
              excerpt: matchingLine.trim(),
              score: item.score,
            }
          })
        )

        return results.sort((a, b) => b.score - a.score)
      },
      SEARCH_CACHE_TTL
    )
  } catch (error) {
    console.error("GitHub search error:", error)
    if (error instanceof Error && error.message.includes("rate limit")) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.")
    }
    throw error
  }
}

export async function clearGithubRequestLogs() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Clear the logs array
  requestLogs = []
  return true
}