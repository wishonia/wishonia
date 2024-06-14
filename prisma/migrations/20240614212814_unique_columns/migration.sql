/*
  Warnings:

  - A unique constraint covering the columns `[userId,thisGlobalProblemSolutionId,thatGlobalProblemSolutionId]` on the table `GlobalProblemSolutionPairAllocation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,thisGlobalSolutionId,thatGlobalSolutionId]` on the table `GlobalSolutionPairAllocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alternateName" TEXT,
    "description" TEXT,
    "url" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "telephone" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "jobTitle" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblemSolutionPairAllocation_userId_thisGlobalProble_key" ON "GlobalProblemSolutionPairAllocation"("userId", "thisGlobalProblemSolutionId", "thatGlobalProblemSolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalSolutionPairAllocation_userId_thisGlobalSolutionId_th_key" ON "GlobalSolutionPairAllocation"("userId", "thisGlobalSolutionId", "thatGlobalSolutionId");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
