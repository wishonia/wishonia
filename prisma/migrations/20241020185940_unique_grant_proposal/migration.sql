/*
  Warnings:

  - A unique constraint covering the columns `[grantId,organizationId]` on the table `GrantProposal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Grant" ADD COLUMN     "contactEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GrantProposal_grantId_organizationId_key" ON "GrantProposal"("grantId", "organizationId");
