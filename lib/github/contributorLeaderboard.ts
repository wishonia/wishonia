import { octokit } from "@/lib/github/octokit"
import { scoreRepoDeveloper } from "@/lib/github/repoContributorScore"

async function getContributors(owner: string, repo: string) {
  console.log(`Searching for contributors to ${owner}/${repo}`)
  let page = 1
  let contributors: any[] = []
  while (true) {
    const response = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 100,
      page,
    })
    if (response.data.length === 0) {
      break
    }
    contributors = contributors.concat(response.data)
    page++
  }
  return contributors
}

export async function contributorLeaderboard(
  ownerRepoArr: string[]
): Promise<void> {
  for (const ownerRepo of ownerRepoArr) {
    let owner, repo
    ;[owner, repo] = ownerRepo.split("/")
    const contributors = await getContributors(owner, repo)

    for (const contributor of contributors) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const username = contributor.login
      if (!username) {
        throw new Error("No username found")
      }
      await scoreRepoDeveloper(owner, repo, username)
    }
  }
}
