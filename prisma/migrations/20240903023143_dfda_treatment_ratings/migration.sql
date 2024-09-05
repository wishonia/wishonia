-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('MINIMAL', 'MILD', 'MODERATE', 'SEVERE', 'EXTREME');

-- CreateEnum
CREATE TYPE "Effectiveness" AS ENUM ('MUCH_WORSE', 'WORSE', 'NO_EFFECT', 'MODERATE_IMPROVEMENT', 'MAJOR_IMPROVEMENT');

-- CreateTable
CREATE TABLE "DfdaCondition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "numberOfTreatments" INTEGER NOT NULL,
    "numberOfSymptoms" INTEGER,
    "numberOfCauses" INTEGER NOT NULL,

    CONSTRAINT "DfdaCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaSymptom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "numberOfConditions" INTEGER NOT NULL,

    CONSTRAINT "DfdaSymptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaTreatment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "numberOfConditions" INTEGER,
    "numberOfSideEffects" INTEGER NOT NULL,

    CONSTRAINT "DfdaTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaSideEffect" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "numberOfTreatments" INTEGER NOT NULL,

    CONSTRAINT "DfdaSideEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaCause" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featuredImage" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "numberOfConditions" INTEGER NOT NULL,

    CONSTRAINT "DfdaCause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaConditionSymptom" (
    "id" SERIAL NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "symptomId" INTEGER NOT NULL,
    "votes" INTEGER NOT NULL,
    "extreme" INTEGER,
    "severe" INTEGER,
    "moderate" INTEGER,
    "mild" INTEGER,
    "minimal" INTEGER,
    "noSymptoms" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DfdaConditionSymptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaConditionTreatment" (
    "id" SERIAL NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "majorImprovement" INTEGER NOT NULL DEFAULT 0,
    "moderateImprovement" INTEGER NOT NULL DEFAULT 0,
    "noEffect" INTEGER NOT NULL DEFAULT 0,
    "worse" INTEGER NOT NULL DEFAULT 0,
    "muchWorse" INTEGER NOT NULL DEFAULT 0,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "averageEffect" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DfdaConditionTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaTreatmentSideEffect" (
    "id" SERIAL NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "sideEffectId" INTEGER NOT NULL,
    "votesPercent" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DfdaTreatmentSideEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaConditionCause" (
    "id" SERIAL NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "causeId" INTEGER NOT NULL,
    "votesPercent" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DfdaConditionCause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaUserConditionReport" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "severity" "Severity" NOT NULL,

    CONSTRAINT "DfdaUserConditionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaUserSymptomReport" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "symptomId" INTEGER NOT NULL,
    "conditionId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "severity" "Severity" NOT NULL,

    CONSTRAINT "DfdaUserSymptomReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaUserTreatmentReport" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "conditionId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "effectiveness" "Effectiveness" NOT NULL,

    CONSTRAINT "DfdaUserTreatmentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DfdaUserSideEffectReport" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "sideEffectId" INTEGER NOT NULL,
    "treatmentId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "severity" "Severity" NOT NULL,

    CONSTRAINT "DfdaUserSideEffectReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DfdaCondition_name_key" ON "DfdaCondition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaCondition_description_key" ON "DfdaCondition"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaSymptom_name_key" ON "DfdaSymptom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaSymptom_description_key" ON "DfdaSymptom"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaTreatment_name_key" ON "DfdaTreatment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaTreatment_description_key" ON "DfdaTreatment"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaSideEffect_name_key" ON "DfdaSideEffect"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaSideEffect_description_key" ON "DfdaSideEffect"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaCause_name_key" ON "DfdaCause"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaCause_description_key" ON "DfdaCause"("description");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaConditionSymptom_conditionId_symptomId_key" ON "DfdaConditionSymptom"("conditionId", "symptomId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaConditionTreatment_treatmentId_conditionId_key" ON "DfdaConditionTreatment"("treatmentId", "conditionId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaTreatmentSideEffect_treatmentId_sideEffectId_key" ON "DfdaTreatmentSideEffect"("treatmentId", "sideEffectId");

-- CreateIndex
CREATE UNIQUE INDEX "DfdaConditionCause_causeId_conditionId_key" ON "DfdaConditionCause"("causeId", "conditionId");

-- AddForeignKey
ALTER TABLE "DfdaConditionSymptom" ADD CONSTRAINT "DfdaConditionSymptom_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaConditionSymptom" ADD CONSTRAINT "DfdaConditionSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "DfdaSymptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaConditionTreatment" ADD CONSTRAINT "DfdaConditionTreatment_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaConditionTreatment" ADD CONSTRAINT "DfdaConditionTreatment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "DfdaTreatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaTreatmentSideEffect" ADD CONSTRAINT "DfdaTreatmentSideEffect_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "DfdaTreatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaTreatmentSideEffect" ADD CONSTRAINT "DfdaTreatmentSideEffect_sideEffectId_fkey" FOREIGN KEY ("sideEffectId") REFERENCES "DfdaSideEffect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaConditionCause" ADD CONSTRAINT "DfdaConditionCause_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaConditionCause" ADD CONSTRAINT "DfdaConditionCause_causeId_fkey" FOREIGN KEY ("causeId") REFERENCES "DfdaCause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserConditionReport" ADD CONSTRAINT "DfdaUserConditionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserConditionReport" ADD CONSTRAINT "DfdaUserConditionReport_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSymptomReport" ADD CONSTRAINT "DfdaUserSymptomReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSymptomReport" ADD CONSTRAINT "DfdaUserSymptomReport_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "DfdaSymptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSymptomReport" ADD CONSTRAINT "DfdaUserSymptomReport_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserTreatmentReport" ADD CONSTRAINT "DfdaUserTreatmentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserTreatmentReport" ADD CONSTRAINT "DfdaUserTreatmentReport_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "DfdaTreatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserTreatmentReport" ADD CONSTRAINT "DfdaUserTreatmentReport_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "DfdaCondition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSideEffectReport" ADD CONSTRAINT "DfdaUserSideEffectReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSideEffectReport" ADD CONSTRAINT "DfdaUserSideEffectReport_sideEffectId_fkey" FOREIGN KEY ("sideEffectId") REFERENCES "DfdaSideEffect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DfdaUserSideEffectReport" ADD CONSTRAINT "DfdaUserSideEffectReport_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "DfdaTreatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
