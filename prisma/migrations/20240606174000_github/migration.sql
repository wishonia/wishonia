/*
  Warnings:

  - Added the required column `stars` to the `GithubProject` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers` to the `GithubUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GithubComment" ADD COLUMN     "githubProjectId" TEXT;

-- AlterTable
ALTER TABLE "GithubProject" ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GithubUser" ADD COLUMN     "followers" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GithubCommit" (
    "id" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "GithubCommit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GithubComment" ADD CONSTRAINT "GithubComment_githubProjectId_fkey" FOREIGN KEY ("githubProjectId") REFERENCES "GithubProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubCommit" ADD CONSTRAINT "GithubCommit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GithubProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
