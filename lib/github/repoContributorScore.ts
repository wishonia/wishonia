import { octokit } from "@/lib/github/octokit";
import { prisma } from "@/lib/db";
import {getGithubUser} from "@/lib/github/githubUser";

async function getCommentReactionsOnCurrentRepoScore(
    owner: string,
    repo: string,
    username: string
): Promise<number> {
    const issues = await octokit.issues.listForRepo({
        owner,
        repo,
        creator: username,
        per_page: 100,
    });
    const reactionCounts = await Promise.all(
        issues.data.map(async (issue) => {
            const comments = await octokit.issues.listComments({
                owner,
                repo,
                issue_number: issue.number,
                per_page: 100,
            });
            const userComments = comments.data.filter(
                (comment) => comment.user?.login === username
            );
            const reactionPromises = userComments.map(async (comment) => {
                const reactions = await octokit.reactions.listForIssueComment({
                    owner,
                    repo,
                    comment_id: comment.id,
                    per_page: 100,
                });
                const reactionWeights: { [key: string]: number } = {
                    "+1": 1,
                    "-1": -1,
                    laugh: 0.5,
                    hooray: 0.75,
                    confused: -0.5,
                    heart: 1,
                    rocket: 1,
                    eyes: 0.5,
                };
                return reactions.data.reduce(
                    (sum, reaction) => sum + (reactionWeights[reaction.content] || 0),
                    0
                );
            });
            return (await Promise.all(reactionPromises)).reduce(
                (sum, score) => sum + score,
                0
            );
        })
    );
    return reactionCounts.reduce((sum, score) => sum + score, 0);
}

async function getCommitsCount(
    owner: string,
    repo: string,
    username: string
): Promise<number> {
    let page = 1;
    let commitsCount = 0;

    while (true) {
        const commits = await octokit.repos.listCommits({
            owner,
            repo,
            author: username,
            per_page: 100,
            page,
        });
        if (commits.data.length === 0) {
            break;
        }
        commitsCount += commits.data.length;
        page++;
    }

    return commitsCount;
}

async function getIssueCommentsOnCurrentRepoCount(
    owner: string,
    repo: string,
    username: string
): Promise<number> {
    const issues = await octokit.issues.listForRepo({
        owner,
        repo,
        creator: username,
        per_page: 100,
    });
    const commentCounts = await Promise.all(
        issues.data.map(async (issue) => {
            const comments = await octokit.issues.listComments({
                owner,
                repo,
                issue_number: issue.number,
                per_page: 100,
            });
            return comments.data.filter((comment) => comment.user?.login === username)
                .length;
        })
    );
    return commentCounts.reduce((sum, count) => sum + count, 0);
}

async function getPullRequestsInfo(
    owner: string,
    repo: string,
    username: string
): Promise<{ totalPRs: number, mergedPRs: number }> {
    let page = 1;
    let totalPRs = 0;
    let mergedPRs = 0;

    while (true) {
        const pullRequests = await octokit.pulls.list({
            owner,
            repo,
            creator: username,
            per_page: 100,
            page,
            state: 'all', // get all pull requests, regardless of state
        });
        if (pullRequests.data.length === 0) {
            break;
        }
        totalPRs += pullRequests.data.length;
        mergedPRs += pullRequests.data.filter(pr => pr.state === 'closed' && pr.merged_at).length;
        page++;
    }

    return { totalPRs, mergedPRs };
}
async function getPullRequestsToCurrentRepoCount(
    owner: string,
    repo: string,
    username: string
): Promise<number> {
    let page = 1;
    let pullRequestsCount = 0;

    while (true) {
        const pullRequests = await octokit.pulls.list({
            owner,
            repo,
            creator: username,
            per_page: 100,
            page,
        });
        if (pullRequests.data.length === 0) {
            break;
        }
        pullRequestsCount += pullRequests.data.length;
        page++;
    }

    return pullRequestsCount;
}

async function getIssuesCreatedOnCurrentRepoCount(
    owner: string,
    repo: string,
    username: string
): Promise<number> {
    let page = 1;
    let issuesCount = 0;

    while (true) {
        const issues = await octokit.issues.listForRepo({
            owner,
            repo,
            creator: username,
            per_page: 100,
            page,
        });
        if (issues.data.length === 0) {
            break;
        }
        issuesCount += issues.data.length;
        page++;
    }

    return issuesCount;
}

export async function scoreRepoDeveloper(
    repoOwner: string,
    repoName: string,
    username: string
) {
    const githubUser = await getGithubUser(username)
    const [
        commitsCount,
        pullRequestsCount,
        issuesCreatedCount,
        issueCommentsCount,
        commentReactionsScore,
    ] = await Promise.all([
        getCommitsCount(repoOwner, repoName, username),
        getPullRequestsToCurrentRepoCount(repoOwner, repoName, username),
        getIssuesCreatedOnCurrentRepoCount(repoOwner, repoName, username),
        getIssueCommentsOnCurrentRepoCount(repoOwner, repoName, username),
        getCommentReactionsOnCurrentRepoScore(repoOwner, repoName, username),
    ]);

    const { totalPRs, mergedPRs } = await getPullRequestsInfo(repoOwner, repoName, username);


    const score =
        commitsCount * 0.3 +
        mergedPRs * 0.25 +
        issuesCreatedCount * 0.2 +
        issueCommentsCount * 0.15 +
        commentReactionsScore * 0.1;

    return prisma.repoContributorScore.upsert({
        where: {
            githubUserId_repoOwner_repoName: {
                githubUserId: githubUser.id,
                repoName: repoName,
                repoOwner: repoOwner
            }
        },
        update: {
            score: score,
            commitsCount: commitsCount,
            totalPullRequestsCount: totalPRs,
            mergedPullRequestsCount: mergedPRs,
            issuesCreatedCount: issuesCreatedCount,
            issueCommentsCount: issueCommentsCount,
            commentReactionsScore: commentReactionsScore
        },
        create: {
            githubUserId: githubUser.id,
            score: score,
            commitsCount: commitsCount,
            totalPullRequestsCount: totalPRs,
            mergedPullRequestsCount: mergedPRs,
            issuesCreatedCount: issuesCreatedCount,
            issueCommentsCount: issueCommentsCount,
            commentReactionsScore: commentReactionsScore,
            repoName: repoName,
            repoOwner: repoOwner
        }
    });
}