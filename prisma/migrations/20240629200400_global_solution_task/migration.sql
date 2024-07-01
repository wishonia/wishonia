/*
  Warnings:

  - You are about to drop the `GlobalTaskSolution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GlobalTaskSolution" DROP CONSTRAINT "GlobalTaskSolution_globalSolutionId_fkey";

-- DropForeignKey
ALTER TABLE "GlobalTaskSolution" DROP CONSTRAINT "GlobalTaskSolution_globalTaskId_fkey";

-- DropTable
DROP TABLE "GlobalTaskSolution";

-- CreateTable
CREATE TABLE "GlobalSolutionTask" (
    "id" TEXT NOT NULL,
    "globalTaskId" TEXT NOT NULL,
    "globalSolutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSolutionTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSolutionTask_globalTaskId_globalSolutionId_key" ON "GlobalSolutionTask"("globalTaskId", "globalSolutionId");

-- AddForeignKey
ALTER TABLE "GlobalSolutionTask" ADD CONSTRAINT "GlobalSolutionTask_globalSolutionId_fkey" FOREIGN KEY ("globalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalSolutionTask" ADD CONSTRAINT "GlobalSolutionTask_globalTaskId_fkey" FOREIGN KEY ("globalTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
