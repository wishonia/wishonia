import { prisma } from "@/lib/db"
import { getGithubUser } from "@/lib/github/githubUser"
import { octokit } from "@/lib/github/octokit"

async function getRepos(username: string): Promise<any[]> {
  let page = 1
  let repos: any[] = []

  while (true) {
    const currentRepos = await octokit.repos.listForUser({
      username,
      per_page: 100,
      page,
    })
    if (currentRepos.data.length === 0) {
      break
    }
    repos = repos.concat(currentRepos.data)
    page++
  }

  return repos
}

export async function scoreGeneralDeveloper(username: string): Promise<void> {
  const githubUser = await getGithubUser(username)
  const repos = await getRepos(username)

  const starsCount = repos.reduce((acc, repo) => {
    return acc + repo.stargazers_count
  })

  const forksCount = repos.reduce((acc, repo) => {
    return acc + repo.forks_count
  })

  const watchersCount = repos.reduce((acc, repo) => {
    return acc + repo.watchers_count
  })

  let score =
    starsCount * 0.4 +
    githubUser.followers_count * 0.3 +
    forksCount * 0.2 +
    watchersCount * 0.1

  if (githubUser.hireable) {
    score *= 1.1
  }

  await prisma.githubUser.update({
    where: {
      id: githubUser.id,
    },
    data: {
      generalDeveloperScore: score,
    },
  })
}
