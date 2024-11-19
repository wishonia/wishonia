import { Octokit } from '@octokit/rest'
import { cache } from 'react'
import { getGithubAccessToken } from './getOauthAccessToken'

export type RepoContent = {
  path: string
  type: 'file' | 'dir'
  name: string
  content?: string
  children?: RepoContent[]
}

// Define the full type for GitHub API response
type GitHubContentResponse = {
  type: 'file' | 'dir' | 'submodule' | 'symlink'
  size: number
  name: string
  path: string
  content?: string
  sha: string
  url: string
  git_url: string | null
  html_url: string | null
  download_url: string | null
  _links: {
    self: string
    git: string | null
    html: string | null
  }
}

// Type guard to check if the item is a file or directory
function isFileOrDir(item: GitHubContentResponse): item is GitHubContentResponse & { type: 'file' | 'dir' } {
  return item.type === 'file' || item.type === 'dir'
}

export const getRepoContents = cache(async (org: string, repo: string, path: string = '', userId: string) => {
  try {
    const githubToken = await getGithubAccessToken(userId)
    const octokit = new Octokit({
      auth: githubToken,
    })

    const response = await octokit.repos.getContent({
      owner: org,
      repo,
      path,
    })

    const contents = Array.isArray(response.data) ? response.data : [response.data]
    
    const processedContents: RepoContent[] = await Promise.all(
      contents
        .filter(isFileOrDir) // Filter out symlinks and submodules
        .map(async (item) => {
          const result: RepoContent = {
            path: item.path,
            type: item.type,
            name: item.name,
          }

          if (item.type === 'dir') {
            result.children = await getRepoContents(org, repo, item.path, userId)
          } else if (item.type === 'file' && item.name.endsWith('.md')) {
            const contentResponse = await octokit.repos.getContent({
              owner: org,
              repo,
              path: item.path,
            })

            if (!Array.isArray(contentResponse.data) && 'content' in contentResponse.data) {
              result.content = Buffer.from(contentResponse.data.content, 'base64').toString()
            }
          }

          return result
        })
    )

    return processedContents
  } catch (error) {
    console.error('Error fetching repo contents:', error)
    return []
  }
}) 