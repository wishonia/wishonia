/*
  Warnings:

  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'NO_ANSWER');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "CallSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "cronExpression" TEXT NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "CallSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledCall" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "status" "CallStatus" NOT NULL DEFAULT 'SCHEDULED',
    "retellCallId" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ScheduledCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CallSchedule_userId_idx" ON "CallSchedule"("userId");

-- CreateIndex
CREATE INDEX "CallSchedule_personId_idx" ON "CallSchedule"("personId");

-- CreateIndex
CREATE INDEX "CallSchedule_agentId_idx" ON "CallSchedule"("agentId");

-- CreateIndex
CREATE INDEX "ScheduledCall_scheduleId_idx" ON "ScheduledCall"("scheduleId");

-- CreateIndex
CREATE INDEX "ScheduledCall_status_idx" ON "ScheduledCall"("status");

-- CreateIndex
CREATE INDEX "ScheduledCall_scheduledFor_idx" ON "ScheduledCall"("scheduledFor");

-- AddForeignKey
ALTER TABLE "CallSchedule" ADD CONSTRAINT "CallSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSchedule" ADD CONSTRAINT "CallSchedule_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSchedule" ADD CONSTRAINT "CallSchedule_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledCall" ADD CONSTRAINT "ScheduledCall_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CallSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
