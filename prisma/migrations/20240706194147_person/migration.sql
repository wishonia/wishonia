/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Person` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "DatasourceStatus" ADD VALUE 'QUEUED';

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_organizationId_fkey";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "organizationId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "personId" TEXT;

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "permissions" JSONB,
    "status" TEXT,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMembership_organizationId_personId_key" ON "OrganizationMembership"("organizationId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "Person_userId_key" ON "Person"("userId");

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
