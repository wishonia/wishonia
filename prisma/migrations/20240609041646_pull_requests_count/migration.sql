/*
  Warnings:

  - You are about to drop the column `pullRequestsCount` on the `RepoContributorScore` table. All the data in the column will be lost.
  - Added the required column `mergedPullRequestsCount` to the `RepoContributorScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPullRequestsCount` to the `RepoContributorScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RepoContributorScore" DROP COLUMN "pullRequestsCount",
ADD COLUMN     "mergedPullRequestsCount" INTEGER NOT NULL,
ADD COLUMN     "totalPullRequestsCount" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "keywords" TEXT[],
    "author" TEXT NOT NULL,
    "repository" TEXT NOT NULL,
    "githubUrl" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);
