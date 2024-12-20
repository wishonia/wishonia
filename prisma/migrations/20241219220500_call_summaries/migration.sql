/*
  Warnings:

  - A unique constraint covering the columns `[userId,personId]` on the table `CallSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotifyMethod" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- AlterTable
ALTER TABLE "ScheduledCall" ADD COLUMN     "callSummary" TEXT;

-- CreateTable
CREATE TABLE "CallSummaryRecipient" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "scheduledCallId" TEXT NOT NULL,
    "notifyBy" "NotifyMethod"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CallSummaryRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CallSummaryRecipient_personId_idx" ON "CallSummaryRecipient"("personId");

-- CreateIndex
CREATE INDEX "CallSummaryRecipient_scheduledCallId_idx" ON "CallSummaryRecipient"("scheduledCallId");

-- CreateIndex
CREATE UNIQUE INDEX "CallSummaryRecipient_personId_scheduledCallId_key" ON "CallSummaryRecipient"("personId", "scheduledCallId");

-- CreateIndex
CREATE UNIQUE INDEX "CallSchedule_userId_personId_key" ON "CallSchedule"("userId", "personId");

-- AddForeignKey
ALTER TABLE "CallSummaryRecipient" ADD CONSTRAINT "CallSummaryRecipient_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallSummaryRecipient" ADD CONSTRAINT "CallSummaryRecipient_scheduledCallId_fkey" FOREIGN KEY ("scheduledCallId") REFERENCES "ScheduledCall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
