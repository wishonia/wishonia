-- CreateEnum
CREATE TYPE "FocusLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'PRIMARY');

-- CreateEnum
CREATE TYPE "ExpertiseLevel" AS ENUM ('BEGINNER', 'MEDIUM', 'EXPERT', 'AUTHORITY');

-- CreateTable
CREATE TABLE "OrganizationGlobalProblem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "globalProblemId" TEXT NOT NULL,
    "focusLevel" "FocusLevel" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "startedAt" TIMESTAMP(3),
    "achievements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationGlobalProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonGlobalProblem" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "globalProblemId" TEXT NOT NULL,
    "role" TEXT,
    "expertise" "ExpertiseLevel" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "startedAt" TIMESTAMP(3),
    "achievements" TEXT[],
    "publications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonGlobalProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationGlobalSolution" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "globalSolutionId" TEXT NOT NULL,
    "role" TEXT,
    "focusLevel" "FocusLevel" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "startedAt" TIMESTAMP(3),
    "achievements" TEXT[],
    "budget" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationGlobalSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonGlobalSolution" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "globalSolutionId" TEXT NOT NULL,
    "role" TEXT,
    "expertise" "ExpertiseLevel" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "startedAt" TIMESTAMP(3),
    "achievements" TEXT[],
    "publications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonGlobalSolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationGlobalProblem_organizationId_idx" ON "OrganizationGlobalProblem"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationGlobalProblem_globalProblemId_idx" ON "OrganizationGlobalProblem"("globalProblemId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationGlobalProblem_organizationId_globalProblemId_key" ON "OrganizationGlobalProblem"("organizationId", "globalProblemId");

-- CreateIndex
CREATE INDEX "PersonGlobalProblem_personId_idx" ON "PersonGlobalProblem"("personId");

-- CreateIndex
CREATE INDEX "PersonGlobalProblem_globalProblemId_idx" ON "PersonGlobalProblem"("globalProblemId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonGlobalProblem_personId_globalProblemId_key" ON "PersonGlobalProblem"("personId", "globalProblemId");

-- CreateIndex
CREATE INDEX "OrganizationGlobalSolution_organizationId_idx" ON "OrganizationGlobalSolution"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationGlobalSolution_globalSolutionId_idx" ON "OrganizationGlobalSolution"("globalSolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationGlobalSolution_organizationId_globalSolutionId_key" ON "OrganizationGlobalSolution"("organizationId", "globalSolutionId");

-- CreateIndex
CREATE INDEX "PersonGlobalSolution_personId_idx" ON "PersonGlobalSolution"("personId");

-- CreateIndex
CREATE INDEX "PersonGlobalSolution_globalSolutionId_idx" ON "PersonGlobalSolution"("globalSolutionId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonGlobalSolution_personId_globalSolutionId_key" ON "PersonGlobalSolution"("personId", "globalSolutionId");

-- AddForeignKey
ALTER TABLE "OrganizationGlobalProblem" ADD CONSTRAINT "OrganizationGlobalProblem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationGlobalProblem" ADD CONSTRAINT "OrganizationGlobalProblem_globalProblemId_fkey" FOREIGN KEY ("globalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonGlobalProblem" ADD CONSTRAINT "PersonGlobalProblem_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonGlobalProblem" ADD CONSTRAINT "PersonGlobalProblem_globalProblemId_fkey" FOREIGN KEY ("globalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationGlobalSolution" ADD CONSTRAINT "OrganizationGlobalSolution_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationGlobalSolution" ADD CONSTRAINT "OrganizationGlobalSolution_globalSolutionId_fkey" FOREIGN KEY ("globalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonGlobalSolution" ADD CONSTRAINT "PersonGlobalSolution_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonGlobalSolution" ADD CONSTRAINT "PersonGlobalSolution_globalSolutionId_fkey" FOREIGN KEY ("globalSolutionId") REFERENCES "GlobalSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
