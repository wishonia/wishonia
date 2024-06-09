/*
  Warnings:

  - The primary key for the `GithubIssue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `body` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `milestoneId` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `GithubIssue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GithubIssue` table. All the data in the column will be lost.
  - The primary key for the `GithubUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `avatarUrl` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `GithubUser` table. All the data in the column will be lost.
  - You are about to drop the `GithubCodebase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubCommit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubIssueLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubMilestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubProjectContributor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubPullRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubPullRequestLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GithubRoadmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignedIssues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignedPullRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GithubIssueToGithubLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GithubLabelToGithubPullRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IssueBlocks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comments_url` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `events_url` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubUserId` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html_url` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labels_url` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `node_id` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repository_url` to the `GithubIssue` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `GithubIssue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `avatar_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `events_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gists_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `html_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `node_id` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizations_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_gists` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_repos` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `received_events_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repos_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site_admin` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starred_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptions_url` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `GithubUser` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `GithubUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "GithubCodebase" DROP CONSTRAINT "GithubCodebase_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubComment" DROP CONSTRAINT "GithubComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "GithubComment" DROP CONSTRAINT "GithubComment_githubProjectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubComment" DROP CONSTRAINT "GithubComment_issueId_fkey";

-- DropForeignKey
ALTER TABLE "GithubComment" DROP CONSTRAINT "GithubComment_pullRequestId_fkey";

-- DropForeignKey
ALTER TABLE "GithubCommit" DROP CONSTRAINT "GithubCommit_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubIssue" DROP CONSTRAINT "GithubIssue_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "GithubIssue" DROP CONSTRAINT "GithubIssue_milestoneId_fkey";

-- DropForeignKey
ALTER TABLE "GithubIssue" DROP CONSTRAINT "GithubIssue_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubIssueLabel" DROP CONSTRAINT "GithubIssueLabel_issueId_fkey";

-- DropForeignKey
ALTER TABLE "GithubIssueLabel" DROP CONSTRAINT "GithubIssueLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "GithubLabel" DROP CONSTRAINT "GithubLabel_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubMilestone" DROP CONSTRAINT "GithubMilestone_githubRoadmapId_fkey";

-- DropForeignKey
ALTER TABLE "GithubMilestone" DROP CONSTRAINT "GithubMilestone_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubProject" DROP CONSTRAINT "GithubProject_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "GithubProjectContributor" DROP CONSTRAINT "GithubProjectContributor_contributorId_fkey";

-- DropForeignKey
ALTER TABLE "GithubProjectContributor" DROP CONSTRAINT "GithubProjectContributor_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubPullRequest" DROP CONSTRAINT "GithubPullRequest_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "GithubPullRequest" DROP CONSTRAINT "GithubPullRequest_milestoneId_fkey";

-- DropForeignKey
ALTER TABLE "GithubPullRequest" DROP CONSTRAINT "GithubPullRequest_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubPullRequestLabel" DROP CONSTRAINT "GithubPullRequestLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "GithubPullRequestLabel" DROP CONSTRAINT "GithubPullRequestLabel_pullRequestId_fkey";

-- DropForeignKey
ALTER TABLE "GithubRequirement" DROP CONSTRAINT "GithubRequirement_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GithubRoadmap" DROP CONSTRAINT "GithubRoadmap_projectId_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedIssues" DROP CONSTRAINT "_AssignedIssues_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedIssues" DROP CONSTRAINT "_AssignedIssues_B_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedPullRequests" DROP CONSTRAINT "_AssignedPullRequests_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedPullRequests" DROP CONSTRAINT "_AssignedPullRequests_B_fkey";

-- DropForeignKey
ALTER TABLE "_GithubIssueToGithubLabel" DROP CONSTRAINT "_GithubIssueToGithubLabel_A_fkey";

-- DropForeignKey
ALTER TABLE "_GithubIssueToGithubLabel" DROP CONSTRAINT "_GithubIssueToGithubLabel_B_fkey";

-- DropForeignKey
ALTER TABLE "_GithubLabelToGithubPullRequest" DROP CONSTRAINT "_GithubLabelToGithubPullRequest_A_fkey";

-- DropForeignKey
ALTER TABLE "_GithubLabelToGithubPullRequest" DROP CONSTRAINT "_GithubLabelToGithubPullRequest_B_fkey";

-- DropForeignKey
ALTER TABLE "_IssueBlocks" DROP CONSTRAINT "_IssueBlocks_A_fkey";

-- DropForeignKey
ALTER TABLE "_IssueBlocks" DROP CONSTRAINT "_IssueBlocks_B_fkey";

-- AlterTable
ALTER TABLE "GithubIssue" DROP CONSTRAINT "GithubIssue_pkey",
DROP COLUMN "body",
DROP COLUMN "closedAt",
DROP COLUMN "createdAt",
DROP COLUMN "creatorId",
DROP COLUMN "embedding",
DROP COLUMN "milestoneId",
DROP COLUMN "priority",
DROP COLUMN "projectId",
DROP COLUMN "state",
DROP COLUMN "updatedAt",
ADD COLUMN     "comments_url" TEXT NOT NULL,
ADD COLUMN     "events_url" TEXT NOT NULL,
ADD COLUMN     "githubUserId" INTEGER NOT NULL,
ADD COLUMN     "html_url" TEXT NOT NULL,
ADD COLUMN     "labels_url" TEXT NOT NULL,
ADD COLUMN     "node_id" TEXT NOT NULL,
ADD COLUMN     "repository_url" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "GithubIssue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GithubUser" DROP CONSTRAINT "GithubUser_pkey",
DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
DROP COLUMN "embedding",
DROP COLUMN "expertise",
DROP COLUMN "updatedAt",
DROP COLUMN "username",
ADD COLUMN     "avatar_url" TEXT NOT NULL,
ADD COLUMN     "blog" TEXT,
ADD COLUMN     "events_url" TEXT NOT NULL,
ADD COLUMN     "followers_url" TEXT NOT NULL,
ADD COLUMN     "following" INTEGER NOT NULL,
ADD COLUMN     "following_url" TEXT NOT NULL,
ADD COLUMN     "generalDeveloperScore" DOUBLE PRECISION,
ADD COLUMN     "gists_url" TEXT NOT NULL,
ADD COLUMN     "gravatar_id" TEXT,
ADD COLUMN     "hireable" BOOLEAN,
ADD COLUMN     "html_url" TEXT NOT NULL,
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "node_id" TEXT NOT NULL,
ADD COLUMN     "organizations_url" TEXT NOT NULL,
ADD COLUMN     "public_gists" INTEGER NOT NULL,
ADD COLUMN     "public_repos" INTEGER NOT NULL,
ADD COLUMN     "received_events_url" TEXT NOT NULL,
ADD COLUMN     "repos_url" TEXT NOT NULL,
ADD COLUMN     "site_admin" BOOLEAN NOT NULL,
ADD COLUMN     "starred_url" TEXT NOT NULL,
ADD COLUMN     "subscriptions_url" TEXT NOT NULL,
ADD COLUMN     "twitter_username" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "GithubUser_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "GithubCodebase";

-- DropTable
DROP TABLE "GithubComment";

-- DropTable
DROP TABLE "GithubCommit";

-- DropTable
DROP TABLE "GithubIssueLabel";

-- DropTable
DROP TABLE "GithubLabel";

-- DropTable
DROP TABLE "GithubMilestone";

-- DropTable
DROP TABLE "GithubProject";

-- DropTable
DROP TABLE "GithubProjectContributor";

-- DropTable
DROP TABLE "GithubPullRequest";

-- DropTable
DROP TABLE "GithubPullRequestLabel";

-- DropTable
DROP TABLE "GithubRequirement";

-- DropTable
DROP TABLE "GithubRoadmap";

-- DropTable
DROP TABLE "_AssignedIssues";

-- DropTable
DROP TABLE "_AssignedPullRequests";

-- DropTable
DROP TABLE "_GithubIssueToGithubLabel";

-- DropTable
DROP TABLE "_GithubLabelToGithubPullRequest";

-- DropTable
DROP TABLE "_IssueBlocks";

-- CreateTable
CREATE TABLE "GithubRepo" (
    "id" INTEGER NOT NULL,
    "node_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "githubUserId" INTEGER NOT NULL,

    CONSTRAINT "GithubRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepoContributorScore" (
    "id" SERIAL NOT NULL,
    "githubUserId" INTEGER NOT NULL,
    "repoOwner" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "commitsCount" INTEGER NOT NULL,
    "pullRequestsCount" INTEGER NOT NULL,
    "issuesCreatedCount" INTEGER NOT NULL,
    "issueCommentsCount" INTEGER NOT NULL,
    "commentReactionsScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RepoContributorScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepoContributorScore_githubUserId_repoOwner_repoName_key" ON "RepoContributorScore"("githubUserId", "repoOwner", "repoName");

-- AddForeignKey
ALTER TABLE "GithubIssue" ADD CONSTRAINT "GithubIssue_githubUserId_fkey" FOREIGN KEY ("githubUserId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubRepo" ADD CONSTRAINT "GithubRepo_githubUserId_fkey" FOREIGN KEY ("githubUserId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepoContributorScore" ADD CONSTRAINT "RepoContributorScore_githubUserId_fkey" FOREIGN KEY ("githubUserId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
