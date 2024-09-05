/*
  Warnings:

  - A unique constraint covering the columns `[userId,conditionId]` on the table `DfdaUserConditionReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,sideEffectId,treatmentId]` on the table `DfdaUserSideEffectReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,symptomId,conditionId]` on the table `DfdaUserSymptomReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,treatmentId,conditionId]` on the table `DfdaUserTreatmentReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tried` to the `DfdaUserTreatmentReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DfdaUserTreatmentReport" ADD COLUMN     "tried" BOOLEAN NOT NULL,
ALTER COLUMN "effectiveness" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DfdaUserConditionReport_userId_conditionId_key" ON "DfdaUserConditionReport"("userId", "conditionId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaUserSideEffectReport_userId_sideEffectId_treatmentId_key" ON "DfdaUserSideEffectReport"("userId", "sideEffectId", "treatmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaUserSymptomReport_userId_symptomId_conditionId_key" ON "DfdaUserSymptomReport"("userId", "symptomId", "conditionId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaUserTreatmentReport_userId_treatmentId_conditionId_key" ON "DfdaUserTreatmentReport"("userId", "treatmentId", "conditionId");
