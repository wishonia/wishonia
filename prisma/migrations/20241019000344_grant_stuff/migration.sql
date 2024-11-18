-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "funder" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "focusAreas" TEXT[],
    "applicationProcess" TEXT NOT NULL,
    "requirements" TEXT[],
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantProposal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "organizationBackground" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "goals" TEXT[],
    "methodology" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "sustainability" TEXT NOT NULL,
    "conclusion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "grantId" TEXT,

    CONSTRAINT "GrantProposal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GrantProposal_organizationId_idx" ON "GrantProposal"("organizationId");

-- CreateIndex
CREATE INDEX "GrantProposal_grantId_idx" ON "GrantProposal"("grantId");

-- AddForeignKey
ALTER TABLE "GrantProposal" ADD CONSTRAINT "GrantProposal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantProposal" ADD CONSTRAINT "GrantProposal_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
