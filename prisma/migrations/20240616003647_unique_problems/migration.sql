/*
  Warnings:

  - A unique constraint covering the columns `[userId,thisGlobalProblemId,thatGlobalProblemId]` on the table `GlobalProblemPairAllocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblemPairAllocation_userId_thisGlobalProblemId_that_key" ON "GlobalProblemPairAllocation"("userId", "thisGlobalProblemId", "thatGlobalProblemId");
