/*
  Warnings:

  - You are about to drop the column `budget` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `featuredImage` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `GlobalTask` table. All the data in the column will be lost.
  - You are about to drop the `_GlobalTaskToGlobalTaskContextUrl` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `complexity` to the `GlobalTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedHours` to the `GlobalTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAtomic` to the `GlobalTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `globalTaskId` to the `GlobalTaskContextUrl` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskComplexity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "DrugClassification" AS ENUM ('OTC', 'PRESCRIPTION_ONLY', 'SCHEDULE_I', 'SCHEDULE_II', 'SCHEDULE_III', 'SCHEDULE_IV', 'SCHEDULE_V', 'UNSCHEDULED');

-- DropForeignKey
ALTER TABLE "_GlobalTaskToGlobalTaskContextUrl" DROP CONSTRAINT "_GlobalTaskToGlobalTaskContextUrl_A_fkey";

-- DropForeignKey
ALTER TABLE "_GlobalTaskToGlobalTaskContextUrl" DROP CONSTRAINT "_GlobalTaskToGlobalTaskContextUrl_B_fkey";

-- AlterTable
ALTER TABLE "GlobalTask" DROP COLUMN "budget",
DROP COLUMN "comments",
DROP COLUMN "content",
DROP COLUMN "dueDate",
DROP COLUMN "embedding",
DROP COLUMN "featuredImage",
DROP COLUMN "priority",
ADD COLUMN     "complexity" "TaskComplexity" NOT NULL,
ADD COLUMN     "estimatedHours" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isAtomic" BOOLEAN NOT NULL,
ADD COLUMN     "output" TEXT;

-- AlterTable
ALTER TABLE "GlobalTaskContextUrl" ADD COLUMN     "globalTaskId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_GlobalTaskToGlobalTaskContextUrl";

-- CreateTable
CREATE TABLE "GlobalTaskRelation" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,

    CONSTRAINT "GlobalTaskRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrugClassificationProfile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "efficacyRate" DOUBLE PRECISION NOT NULL,
    "adverseEventRate" DOUBLE PRECISION NOT NULL,
    "severeAdverseEventRate" DOUBLE PRECISION NOT NULL,
    "drugInteractionIndex" DOUBLE PRECISION NOT NULL,
    "therapeuticIndex" DOUBLE PRECISION NOT NULL,
    "abusePotentialScore" DOUBLE PRECISION NOT NULL,
    "withdrawalSeverityIndex" DOUBLE PRECISION NOT NULL,
    "overdoseRiskFactor" DOUBLE PRECISION NOT NULL,
    "misuseProbability" DOUBLE PRECISION NOT NULL,
    "selfAdministrationSafety" DOUBLE PRECISION NOT NULL,
    "accessBenefitRatio" DOUBLE PRECISION NOT NULL,
    "societalCostIndex" DOUBLE PRECISION NOT NULL,
    "otcScore" DOUBLE PRECISION,
    "prescriptionScore" DOUBLE PRECISION,
    "schedulingScore" DOUBLE PRECISION,
    "accessRestrictionBenefitScore" DOUBLE PRECISION,
    "finalClassificationScore" DOUBLE PRECISION,
    "classification" "DrugClassification",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrugClassificationProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GlobalTaskRelation_parentId_childId_key" ON "GlobalTaskRelation"("parentId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "DrugClassificationProfile_name_key" ON "DrugClassificationProfile"("name");

-- AddForeignKey
ALTER TABLE "GlobalTaskRelation" ADD CONSTRAINT "GlobalTaskRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskRelation" ADD CONSTRAINT "GlobalTaskRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTaskContextUrl" ADD CONSTRAINT "GlobalTaskContextUrl_globalTaskId_fkey" FOREIGN KEY ("globalTaskId") REFERENCES "GlobalTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
