import fs from "fs"
import path from "path"

import { prisma } from "@/lib/db"
import { absPathFromRepo } from "@/lib/fileHelper"
import { contributorLeaderboard } from "@/lib/github/contributorLeaderboard"

const couldNotFind: string[] = []

export async function getOwnerRepoFromNpm(
  libraryName: string
): Promise<string | null | false> {
  let repo = getGitHubRepoFromNodeModules(libraryName)
  if (repo) {
    return repo
  }
  try {
    console.log(`Fetching data for ${libraryName}`)
    const response = await fetch(`https://registry.npmjs.org/${libraryName}`)
    const data = await response.json()
    let result = extractRepoFromPackageData(data)
    if (!result) {
      let result = extractRepoFromPackageData(data)
      console.log(`No repository found for ${libraryName}`)
      couldNotFind.push(libraryName)
      return false
    }
    return result
  } catch (e) {
    console.log(`Error fetching data for ${libraryName}`, e)
    return false
  }
}

function getGitHubRepoFromNodeModules(libraryName: string): string | null {
  const packageJsonPath = path.join("node_modules", libraryName, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    const file = fs.readFileSync(packageJsonPath, "utf8")
    const packageJson = JSON.parse(file)
    return extractRepoFromPackageData(packageJson)
  }
  return null
}

function extractRepoFromPackageData(data: {
  name: string
  repository?: { url: string }
  homepage?: string
  bugs?: { url: string }
}) {
  let repositoryUrl = data.repository?.url

  if (!repositoryUrl) {
    repositoryUrl = data.homepage
  }

  if (!repositoryUrl && data.bugs && typeof data.bugs === "object") {
    repositoryUrl = data.bugs.url
  }
  if (!repositoryUrl && data.bugs && data.bugs.url) {
    repositoryUrl = data.bugs.url
  }
  if (repositoryUrl) {
    let match = repositoryUrl.match(
      /https?:\/\/(?:www\.)?github\.com\/([^/]+\/[^/]+)/i
    )
    if (!match) {
      // handle git@github.com:langchain-ai/langchainjs.git
      match = repositoryUrl.match(/github\.com:([^/]+\/[^/]+)/i)
    }
    if (!match) {
      // Handle https://github.com/cheeriojs/cheerio/issues
      match = repositoryUrl.match(/github\.com\/([^/]+\/[^/]+)/i)
    }
    if (match) {
      const ownerRepo = match[1]
      // Remove .git and .git#branch from the end of the string
      return ownerRepo.replace(/\.git(?:#.*)?$/, "")
    }
  }
  return null
}

function readPackageJson(packageJsonPath: string): string[] {
  const file = fs.readFileSync(packageJsonPath, "utf8")
  const packageJson = JSON.parse(file)
  const dependencies = packageJson.dependencies || {}
  return Object.keys(dependencies)
}

async function getReposFromPackageJson(packageJsonPath: string | undefined) {
  if (!packageJsonPath) {
    packageJsonPath = absPathFromRepo("package.json")
  }
  const libraries = readPackageJson(packageJsonPath)
  let ownerRepoArr = []
  for (const library of libraries) {
    let repo = getGitHubRepoFromNodeModules(library)
    if (repo) {
      ownerRepoArr.push(repo)
    } else {
      let repo = await getOwnerRepoFromNpm(library)
      if (repo) {
        ownerRepoArr.push(repo)
      } else {
        couldNotFind.push(library)
      }
    }
  }
  console.log(
    "Could not find repositories for the following libraries:",
    couldNotFind.join("\n, ")
  )
  let validOwnerRepoArr = ownerRepoArr.filter(
    (path): path is string => path !== null
  )
  return Array.from(new Set(validOwnerRepoArr)) // Remove duplicates
}

export async function scoreContributorsFromPackageJson(
  packageJsonPath?: string,
  topN: number = 10
) {
  let validOwnerRepoArr = await getReposFromPackageJson(packageJsonPath)
  await contributorLeaderboard(validOwnerRepoArr)
  return prisma.githubUser.findMany({
    include: {
      repoDeveloperScores: true,
    },
  })
}
