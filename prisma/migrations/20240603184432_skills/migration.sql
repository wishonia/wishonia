/*
  Warnings:

  - You are about to drop the column `skillId` on the `Endorsement` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Skill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[description]` on the table `GlobalProblem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content]` on the table `GlobalProblem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "UserTaskRole" AS ENUM ('ASSIGNEE', 'REVIEWER', 'COLLABORATOR');

-- DropForeignKey
ALTER TABLE "Endorsement" DROP CONSTRAINT "Endorsement_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_userId_fkey";

-- AlterTable
ALTER TABLE "Endorsement" DROP COLUMN "skillId",
ADD COLUMN     "userSkillId" TEXT;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSolution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageAllocation" DOUBLE PRECISION,

    CONSTRAINT "GlobalSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalSolutionPairAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thisGlobalSolutionId" TEXT NOT NULL,
    "thatGlobalSolutionId" TEXT NOT NULL,
    "thisGlobalSolutionPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSolutionPairAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalProblemSolution" (
    "id" TEXT NOT NULL,
    "globalProblemId" TEXT NOT NULL,
    "globalSolutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalProblemSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTaskSolution" (
    "id" TEXT NOT NULL,
    "globalTaskId" TEXT NOT NULL,
    "globalSolutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalTaskSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priority" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "dueDate" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "comments" TEXT[],

    CONSTRAINT "GlobalTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTaskSkill" (
    "id" TEXT NOT NULL,
    "globalTaskId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "GlobalTaskSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTaskDependency" (
    "id" TEXT NOT NULL,
    "blockingTaskId" TEXT NOT NULL,
    "dependentTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalTaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTaskContextUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalTaskContextUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "globalTaskId" TEXT NOT NULL,
    "role" "UserTaskRole" NOT NULL DEFAULT 'ASSIGNEE',
    "status" "TaskStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "comments" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "repository" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "url" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "company" TEXT,
    "expertise" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubIssue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "priority" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "embedding" vector(1536),

    CONSTRAINT "GithubIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubPullRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "milestoneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mergedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "embedding" vector(1536),

    CONSTRAINT "GithubPullRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubComment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "issueId" TEXT,
    "pullRequestId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubLabel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubIssueLabel" (
    "issueId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubIssueLabel_pkey" PRIMARY KEY ("issueId","labelId")
);

-- CreateTable
CREATE TABLE "GithubPullRequestLabel" (
    "pullRequestId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubPullRequestLabel_pkey" PRIMARY KEY ("pullRequestId","labelId")
);

-- CreateTable
CREATE TABLE "GithubMilestone" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "state" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "embedding" vector(1536),
    "githubRoadmapId" TEXT,

    CONSTRAINT "GithubMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubProjectContributor" (
    "projectId" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "role" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GithubProjectContributor_pkey" PRIMARY KEY ("projectId","contributorId")
);

-- CreateTable
CREATE TABLE "GithubCodebase" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubCodebase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubRequirement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubRoadmap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "GithubRoadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GlobalTaskToGlobalTaskContextUrl" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AssignedIssues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GithubIssueToGithubLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IssueBlocks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AssignedPullRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_GithubLabelToGithubPullRequest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSolution_name_key" ON "GlobalSolution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSolution_description_key" ON "GlobalSolution"("description");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSolution_content_key" ON "GlobalSolution"("content");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblemSolution_globalProblemId_globalSolutionId_key" ON "GlobalProblemSolution"("globalProblemId", "globalSolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTaskSolution_globalTaskId_globalSolutionId_key" ON "GlobalTaskSolution"("globalTaskId", "globalSolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTask_name_key" ON "GlobalTask"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTask_description_key" ON "GlobalTask"("description");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTask_content_key" ON "GlobalTask"("content");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTaskSkill_globalTaskId_skillId_key" ON "GlobalTaskSkill"("globalTaskId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTaskDependency_blockingTaskId_dependentTaskId_key" ON "GlobalTaskDependency"("blockingTaskId", "dependentTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTaskContextUrl_url_key" ON "GlobalTaskContextUrl"("url");

-- CreateIndex
CREATE UNIQUE INDEX "UserTask_userId_globalTaskId_key" ON "UserTask"("userId", "globalTaskId");

-- CreateIndex
CREATE UNIQUE INDEX "_GlobalTaskToGlobalTaskContextUrl_AB_unique" ON "_GlobalTaskToGlobalTaskContextUrl"("A", "B");

-- CreateIndex
CREATE INDEX "_GlobalTaskToGlobalTaskContextUrl_B_index" ON "_GlobalTaskToGlobalTaskContextUrl"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedIssues_AB_unique" ON "_AssignedIssues"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedIssues_B_index" ON "_AssignedIssues"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GithubIssueToGithubLabel_AB_unique" ON "_GithubIssueToGithubLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_GithubIssueToGithubLabel_B_index" ON "_GithubIssueToGithubLabel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IssueBlocks_AB_unique" ON "_IssueBlocks"("A", "B");

-- CreateIndex
CREATE INDEX "_IssueBlocks_B_index" ON "_IssueBlocks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedPullRequests_AB_unique" ON "_AssignedPullRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedPullRequests_B_index" ON "_AssignedPullRequests"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GithubLabelToGithubPullRequest_AB_unique" ON "_GithubLabelToGithubPullRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_GithubLabelToGithubPullRequest_B_index" ON "_GithubLabelToGithubPullRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblem_description_key" ON "GlobalProblem"("description");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblem_content_key" ON "GlobalProblem"("content");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endorsement" ADD CONSTRAINT "Endorsement_userSkillId_fkey" FOREIGN KEY ("userSkillId") REFERENCES "UserSkill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSolution" ADD CONSTRAINT "GlobalSolution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSolutionPairAllocation" ADD CONSTRAINT "GlobalSolutionPairAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSolutionPairAllocation" ADD CONSTRAINT "GlobalSolutionPairAllocation_thisGlobalSolutionId_fkey" FOREIGN KEY ("thisGlobalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSolutionPairAllocation" ADD CONSTRAINT "GlobalSolutionPairAllocation_thatGlobalSolutionId_fkey" FOREIGN KEY ("thatGlobalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemSolution" ADD CONSTRAINT "GlobalProblemSolution_globalProblemId_fkey" FOREIGN KEY ("globalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemSolution" ADD CONSTRAINT "GlobalProblemSolution_globalSolutionId_fkey" FOREIGN KEY ("globalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskSolution" ADD CONSTRAINT "GlobalTaskSolution_globalTaskId_fkey" FOREIGN KEY ("globalTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskSolution" ADD CONSTRAINT "GlobalTaskSolution_globalSolutionId_fkey" FOREIGN KEY ("globalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTask" ADD CONSTRAINT "GlobalTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskSkill" ADD CONSTRAINT "GlobalTaskSkill_globalTaskId_fkey" FOREIGN KEY ("globalTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskSkill" ADD CONSTRAINT "GlobalTaskSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskDependency" ADD CONSTRAINT "GlobalTaskDependency_blockingTaskId_fkey" FOREIGN KEY ("blockingTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskDependency" ADD CONSTRAINT "GlobalTaskDependency_dependentTaskId_fkey" FOREIGN KEY ("dependentTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTask" ADD CONSTRAINT "UserTask_globalTaskId_fkey" FOREIGN KEY ("globalTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubProject" ADD CONSTRAINT "GithubProject_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIssue" ADD CONSTRAINT "GithubIssue_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIssue" ADD CONSTRAINT "GithubIssue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIssue" ADD CONSTRAINT "GithubIssue_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "GithubMilestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubPullRequest" ADD CONSTRAINT "GithubPullRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubPullRequest" ADD CONSTRAINT "GithubPullRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubPullRequest" ADD CONSTRAINT "GithubPullRequest_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "GithubMilestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubComment" ADD CONSTRAINT "GithubComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "GithubIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubComment" ADD CONSTRAINT "GithubComment_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "GithubPullRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubComment" ADD CONSTRAINT "GithubComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubLabel" ADD CONSTRAINT "GithubLabel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIssueLabel" ADD CONSTRAINT "GithubIssueLabel_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "GithubIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubIssueLabel" ADD CONSTRAINT "GithubIssueLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "GithubLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubPullRequestLabel" ADD CONSTRAINT "GithubPullRequestLabel_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "GithubPullRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubPullRequestLabel" ADD CONSTRAINT "GithubPullRequestLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "GithubLabel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubMilestone" ADD CONSTRAINT "GithubMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubMilestone" ADD CONSTRAINT "GithubMilestone_githubRoadmapId_fkey" FOREIGN KEY ("githubRoadmapId") REFERENCES "GithubRoadmap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubProjectContributor" ADD CONSTRAINT "GithubProjectContributor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubProjectContributor" ADD CONSTRAINT "GithubProjectContributor_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "GithubUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubCodebase" ADD CONSTRAINT "GithubCodebase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubRequirement" ADD CONSTRAINT "GithubRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubRoadmap" ADD CONSTRAINT "GithubRoadmap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalTaskToGlobalTaskContextUrl" ADD CONSTRAINT "_GlobalTaskToGlobalTaskContextUrl_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalTaskToGlobalTaskContextUrl" ADD CONSTRAINT "_GlobalTaskToGlobalTaskContextUrl_B_fkey" FOREIGN KEY ("B") REFERENCES "GlobalTaskContextUrl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedIssues" ADD CONSTRAINT "_AssignedIssues_A_fkey" FOREIGN KEY ("A") REFERENCES "GithubIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedIssues" ADD CONSTRAINT "_AssignedIssues_B_fkey" FOREIGN KEY ("B") REFERENCES "GithubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GithubIssueToGithubLabel" ADD CONSTRAINT "_GithubIssueToGithubLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "GithubIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GithubIssueToGithubLabel" ADD CONSTRAINT "_GithubIssueToGithubLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "GithubLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueBlocks" ADD CONSTRAINT "_IssueBlocks_A_fkey" FOREIGN KEY ("A") REFERENCES "GithubIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IssueBlocks" ADD CONSTRAINT "_IssueBlocks_B_fkey" FOREIGN KEY ("B") REFERENCES "GithubIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedPullRequests" ADD CONSTRAINT "_AssignedPullRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "GithubPullRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedPullRequests" ADD CONSTRAINT "_AssignedPullRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "GithubUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GithubLabelToGithubPullRequest" ADD CONSTRAINT "_GithubLabelToGithubPullRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "GithubLabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GithubLabelToGithubPullRequest" ADD CONSTRAINT "_GithubLabelToGithubPullRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "GithubPullRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
