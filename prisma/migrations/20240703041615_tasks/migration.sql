/*
  Warnings:

  - You are about to drop the column `estimatedHours` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `GlobalTask` table. All the data in the column will be lost.
  - Made the column `isAtomic` on table `GlobalTask` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GlobalTask" DROP COLUMN "estimatedHours",
DROP COLUMN "output",
DROP COLUMN "status",
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "deliverable" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[],
ALTER COLUMN "isAtomic" SET NOT NULL,
ALTER COLUMN "isAtomic" SET DEFAULT false;

-- CreateTable
CREATE TABLE "GlobalTaskAttachment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalTaskAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTaskComment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalTaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskComment" (
    "id" TEXT NOT NULL,
    "userTaskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTaskAttachment" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTaskAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GlobalTaskAttachment" ADD CONSTRAINT "GlobalTaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskAttachment" ADD CONSTRAINT "GlobalTaskAttachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskComment" ADD CONSTRAINT "GlobalTaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskComment" ADD CONSTRAINT "GlobalTaskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskComment" ADD CONSTRAINT "UserTaskComment_userTaskId_fkey" FOREIGN KEY ("userTaskId") REFERENCES "UserTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskComment" ADD CONSTRAINT "UserTaskComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskAttachment" ADD CONSTRAINT "UserTaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "UserTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTaskAttachment" ADD CONSTRAINT "UserTaskAttachment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
