'use server'

import { generateObject } from 'ai'
import matter from 'gray-matter'
import { z } from 'zod'

import { FileItem } from '@/components/github/types'
import prisma from '@/lib/prisma'
import { githubSlugify } from '@/lib/utils/githubSlugify'
import { getModel } from '@/lib/utils/modelUtils'
import { slugify } from '@/lib/utils/slugify'

const ArticleMetadataSchema = z.object({
  title: z.string().describe("A clear, descriptive title for the article"),
  description: z.string().describe("A brief summary of the article's content"),
  tags: z.array(z.string()).describe("Relevant tags based on the content"),
  categoryName: z.string().describe("The most appropriate category for this content"),
})

export async function fetchGithubOrganizations(accessToken: string | null) {
  console.log('GitHub API: Initializing request with token:', accessToken?.slice(0, 4) + '...')

  try {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      const responseScopes = userResponse.headers.get('x-oauth-scopes')
      const errorBody = await userResponse.text().catch(() => 'No error body')
      console.error('GitHub API Error:', {
        endpoint: 'user',
        status: userResponse.status,
        statusText: userResponse.statusText,
        errorBody,
        authDetails: {
          scopes: responseScopes?.split(',').map(s => s.trim()),
          acceptHeader: userResponse.headers.get('x-accepted-oauth-scopes'),
        },
        rateLimit: {
          limit: userResponse.headers.get('x-ratelimit-limit'),
          remaining: userResponse.headers.get('x-ratelimit-remaining'),
          reset: new Date(
              Number(userResponse.headers.get('x-ratelimit-reset')) * 1000
          ).toISOString(),
        }
      })

      if (userResponse.status === 401) {
        throw new Error('GitHub token is invalid or expired. Please reconnect your GitHub account.')
      }
      throw new Error(`GitHub API error (${userResponse.status}): ${userResponse.statusText}`)
    }

    const userData = await userResponse.json()
    console.log('GitHub API: Successfully fetched user data for:', userData.login)

    const userAccount = {
      login: userData.login,
      id: userData.id,
      avatar_url: userData.avatar_url,
      description: 'Personal Account'
    }

    const orgsResponse = await fetch('https://api.github.com/user/orgs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (!orgsResponse.ok) {
      console.error("Orgs response not ok:", orgsResponse.status, orgsResponse.statusText)
      if (orgsResponse.status === 401) {
        throw new Error('GitHub authentication failed')
      }
      throw new Error(`GitHub API error: ${orgsResponse.status}`)
    }
    const orgs = await orgsResponse.json()

    const allOrgs = [userAccount, ...orgs]
    return allOrgs
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('GitHub API Error:', errorMessage)
    throw new Error(errorMessage)
  }
}

export async function fetchGithubRepositories(accessToken: string | null, org: string) {
  try {
    // First, get the user data to get their username
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status}`)
    }

    const userData = await userResponse.json()

    // If org matches the user's login or is "Personal Account", fetch user's repos
    const isPersonalAccount = org === userData.login || org === 'Personal Account'
    const url = isPersonalAccount
        ? `https://api.github.com/user/repos` // Use authenticated endpoint for better rate limits
        : `https://api.github.com/orgs/${org}/repos`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      console.error('GitHub API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      })
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()
    return repos
  } catch (error) {
    console.error('Error fetching repositories:', error)
    throw error // Re-throw the error instead of returning empty array
  }
}

export async function fetchGithubFiles(accessToken: string | null, org: string, repo: string | undefined, path: string = '') {
  try {
    const response = await fetch(
        `https://api.github.com/repos/${org}/${repo}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('GitHub authentication failed')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const files = await response.json()
    return Array.isArray(files) ? files : [files]
  } catch (error) {
    console.error('Error fetching files:', error)
    return []
  }
}

export async function fetchExistingArticles(org: string, repo: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        sources: {
          some: {
            url: {
              startsWith: `github:${org}/${repo}/`
            }
          }
        }
      },
      select: {
        slug: true,
        title: true,
        sources: {
          select: {
            url: true
          }
        }
      }
    })

    return articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      source: article.sources[0].url
    }))
  } catch (error) {
    console.error('Error fetching existing articles:', error)
    return []
  }
}

export async function createArticle(accessToken: string | null, session: any,
                                    selectedOrg: string, selectedRepo: string, file: FileItem) {
  try {
    const response = await fetch(
        `https://api.github.com/repos/${selectedOrg}/${selectedRepo}/contents/${file.path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('GitHub authentication failed')
      }
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    const content = Buffer.from(data.content, 'base64').toString('utf-8')

    // Parse frontmatter metadata if it exists
    const { data: frontmatter, content: cleanContent } = matter(content)

    // Generate metadata if not provided in frontmatter
    let metadata = frontmatter
    if (!frontmatter.title || !frontmatter.description || !frontmatter.tags || !frontmatter.categoryName) {
      const model = getModel()
      const result = await generateObject({
        model,
        schema: ArticleMetadataSchema,
        prompt: `
          Analyze this content and generate appropriate metadata:
          ${cleanContent.slice(0, 2000)}... // Limit content length for prompt
          
          Guidelines:
          - Title should be clear and descriptive
          - Description should summarize key points
          - Tags should be relevant for search and categorization
          - Category should reflect the main topic area
        `
      })

      metadata = {
        title: frontmatter.title || result.object.title,
        description: frontmatter.description || result.object.description,
        tags: frontmatter.tags || result.object.tags,
        categoryName: frontmatter.categoryName || result.object.categoryName
      }
    }

    // Find or create category
    let category = await prisma.articleCategory.findFirst({
      where: { slug: 'github-imports' }
    })
    if (!category) {
      category = await prisma.articleCategory.create({
        data: {
          name: metadata.categoryName || 'GitHub Imports',
          slug: 'github-imports',
          description: 'Articles imported from GitHub repositories'
        }
      })
    }

    // Create tags if they exist
    const tags = metadata.tags ? await Promise.all(
        metadata.tags.map(async (tagName: string) => {
          const slug = slugify(tagName)
          return prisma.articleTag.upsert({
            where: { slug },
            create: { name: tagName, slug },
            update: { name: tagName }
          })
        })
    ) : []

    const slug = githubSlugify(
        metadata.title || file.name,
        session.user.id,
        selectedRepo,
        file.path
    )

    const article = await prisma.article.create({
      data: {
        title: metadata.title || file.name,
        slug,
        description: metadata.description || `Imported from GitHub: github:${selectedOrg}/${selectedRepo}/${file.path}`,
        content: cleanContent,
        status: 'DRAFT',
        userId: session.user.id,
        categoryId: category.id,
        tags: {
          connect: tags.map(tag => ({ id: tag.id }))
        },
        sources: {
          create: [{
            url: `github:${selectedOrg}/${selectedRepo}/${file.path}`,
            title: 'GitHub Source',
            description: 'Imported from GitHub repository'
          }]
        }
      }
    })

    return await fetchExistingArticles(selectedOrg, selectedRepo)
  } catch (error) {
    console.error('Error creating article:', error)
    throw error
  }
}

export async function deleteGithubAccount(userId: string) {
  'use server'
  try {
    console.log('Deleting GitHub account for user:', userId)
    await prisma.account.deleteMany({
      where: {
        userId: userId,
        provider: 'github'
      }
    })
    console.log('Successfully deleted GitHub account records')
    return true
  } catch (error) {
    console.error('Error deleting GitHub account:', error)
    return false
  }
}

export async function searchGithubRepository(
    accessToken: string | null,
    org: string,
    repo: string,
    query: string
) {
  try {
    const response = await fetch(
        `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:${org}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform the search results into FileItem format
    const files: FileItem[] = data.items.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: 'file',
      size: undefined, // Size not available in search results
      download_url: item.html_url,
    }))

    return files
  } catch (error) {
    console.error('Error searching repository:', error)
    return []
  }
}

export async function fetchFileContent(
    accessToken: string | null,
    org: string,
    repo: string,
    path: string
) {
  try {
    const response = await fetch(
        `https://api.github.com/repos/${org}/${repo}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return content
  } catch (error) {
    console.error('Error fetching file content:', error)
    throw error
  }
}
