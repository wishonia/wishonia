import {octokit} from "@/lib/github/octokit";
import {getGithubUser} from "@/lib/github/githubUser";

export async function searchDevelopersByLibraries(libraries: string[]) {
    const query = libraries.map((library) => `filename:package.json ${library}`).join(" ");
    const searchResults = await octokit.search.code({ q: query });

    const developers: Record<string, any> = {};

    for (const result of searchResults.data.items) {
        const [, username, repo] = result.repository.full_name.split("/");

        if (!developers[username]) {
            const user = await getGithubUser(username)
            developers[username] = {
                username,
                name: user.data.name,
                email: user.data.email,
                followers: user.data.followers,
                repos: [],
            };
        }

        const repoData = await octokit.repos.get({ owner: username, repo });
        const commits = await octokit.repos.listCommits({ owner: username, repo });
        const issues = await octokit.issues.listForRepo({ owner: username, repo });
        const comments = await octokit.issues.listCommentsForRepo({ owner: username, repo });

        developers[username].repos.push({
            name: repo,
            url: repoData.data.html_url,
            stars: repoData.data.stargazers_count,
            commits: commits.data.map((commit: any) => ({
                sha: commit.sha,
                message: commit.commit.message,
                url: commit.html_url,
            })),
            issues: issues.data.map((issue: any) => ({
                number: issue.number,
                title: issue.title,
                url: issue.html_url,
            })),
            comments: comments.data.map((comment: any) => ({
                id: comment.id,
                body: comment.body,
                url: comment.html_url,
            })),
        });
    }

    return Object.values(developers);
}
