/**
 * @jest-environment node
 */
import { generatePrismaSchema } from "@/lib/db/schemaGenerator"
import { searchDevelopersByLibraries } from "@/lib/github/githubAgent"
import { getGithubUser } from "@/lib/github/githubUser"
import {
  getOwnerRepoFromNpm,
  scoreContributorsFromPackageJson,
} from "@/lib/github/npmLibraries"
import { octokit } from "@/lib/github/octokit"
import { scoreRepoDeveloper } from "@/lib/github/repoContributorScore"

describe("Github API Test", () => {
  it("should find github developers with @langchain/community experience", async () => {
    const devs = await searchDevelopersByLibraries(["@langchain/community"])
    expect(devs).toBeDefined()
  })
  it("should generate the Prisma schema for a GitHub user", async () => {
    const username = "mikepsinn"

    // Fetch the user data from the GitHub API
    const response = await getGithubUser(username)
    const userData = response.data
    // Generate the Prisma schema for the user
    const schema = generatePrismaSchema("GithubUser", userData)
  }, 600000)

  it("should score repo developer", async () => {
    const owner = "wishonia"
    const repo = "wishonia"
    const username = "mikepsinn"
    const score = await scoreRepoDeveloper(owner, repo, username)
    expect(score).toBeDefined()
  })
  it("should search for developers with experience with the libraries used", async () => {
    const devs = await scoreContributorsFromPackageJson()
    expect(devs).toBeDefined()
  }, 600000)
  it("should get github repo from npm library", async () => {
    let repo
    const libraries = [
      "cheerio",
      "@langchain/community",
      //"@llamaindex/pdf-viewer"
    ]
    for (const library of libraries) {
      repo = await getOwnerRepoFromNpm(library)
      expect(repo).toBeTruthy()
    }
  })
  it("should generate the Prisma schema for a GitHub repository", async () => {
    const repository = "wishonia"
    const org = "wishonia"
    const repoData = await octokit.repos.get({ owner: org, repo: repository })
    // get repo info
    generatePrismaSchema("GithubRepo", repoData.data, "Github")
  }, 600000)

  it("should generate the Prisma schema for a GitHub project", async () => {
    const repository = "wishonia"
    const org = "wishonia"
    const projects = await octokit.projects.listForRepo({
      owner: org,
      repo: repository,
    })
    if (projects.data.length) {
      generatePrismaSchema("GithubProject", projects.data[0], "Github")
      const projectColumns = await octokit.projects.listColumns({
        project_id: projects.data[0].id,
      })
      generatePrismaSchema(
        "GithubProjectColumn",
        projectColumns.data[0],
        "Github"
      )
      const projectCards = await octokit.projects.listCards({
        column_id: projectColumns.data[0].id,
      })
      generatePrismaSchema("GithubProjectCard", projectCards.data[0], "Github")
    }
  }, 600000)

  // Uncomment and implement the following tests as needed

  // it('should generate the Prisma schema for GitHub commits', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const commits =
  //         await octokit.repos.listCommits({ owner: org, repo: repository });
  //     generatePrismaSchema('Commit', commits.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub issues', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const issues = await octokit.issues.listForRepo({ owner: org, repo: repository });
  //     generatePrismaSchema('GithubIssue', issues.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub comments', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const comments = await octokit.issues.listCommentsForRepo({ owner: org, repo: repository });
  //     generatePrismaSchema('GithubComment', comments.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub search results', async () => {
  //     const repository = 'wishonia'
  //     const filename = 'package.json';
  //     const searchResults = await octokit.search.code({ q: `filename:${filename} ${repository}` });
  //     generatePrismaSchema('GithubSearchResult', searchResults.data.items[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for a GitHub file', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const filename = 'package.json';
  //     const file = await octokit.repos.getContent({ owner: org, repo: repository, path: filename });
  //     generatePrismaSchema('GithubFile', file.data, "Github");
  // }, 600000);

  // it('should generate the Prisma schema for a GitHub starred repo', async () => {
  //     const username = 'mikepsinn';
  //     const starredRepos = await octokit.activity.listReposStarredByUser({ username });
  //     generatePrismaSchema('GithubStarredRepo', starredRepos.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub pull requests', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const pullRequests = await octokit.pulls.list({ owner: org, repo: repository });
  //     generatePrismaSchema('GithubPullRequest', pullRequests.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub milestones', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const milestones = await octokit.issues.listMilestones({ owner: org, repo: repository });
  //     generatePrismaSchema('GithubMilestone', milestones.data[0], "Github");
  // }, 600000);

  // it('should generate the Prisma schema for GitHub labels', async () => {
  //     const repository = 'wishonia'
  //     const org = 'wishonia';
  //     const labels =
  //         await octokit.issues.listLabelsForRepo({ owner: org, repo: repository });
  //     generatePrismaSchema('GithubLabel', labels.data[0]);
  // }, 600000);
})
