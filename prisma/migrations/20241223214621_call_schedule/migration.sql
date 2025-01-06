/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,scheduledFor]` on the table `ScheduledCall` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Severity" ADD VALUE 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledCall_scheduleId_scheduledFor_key" ON "ScheduledCall"("scheduleId", "scheduledFor");
