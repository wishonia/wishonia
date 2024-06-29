import { prisma } from "@/lib/db"
import { octokit } from "@/lib/github/octokit"

export async function getGithubUser(username: string): Promise<any> {
  const userResponse = await octokit.users.getByUsername({ username })
  let githubUser = await prisma.githubUser.findUnique({
    where: {
      id: userResponse.data.id,
    },
  })
  if (!githubUser) {
    githubUser = await prisma.githubUser.create({
      data: userResponse.data,
    })
  }
  return githubUser
}
