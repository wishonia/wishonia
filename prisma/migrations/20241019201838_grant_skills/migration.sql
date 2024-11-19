-- AlterTable
ALTER TABLE "Grant" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "eligibility" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "applicationProcess" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GrantSkill" (
    "id" TEXT NOT NULL,
    "grantId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrantSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrantSkill_grantId_skillId_key" ON "GrantSkill"("grantId", "skillId");

-- AddForeignKey
ALTER TABLE "GrantSkill" ADD CONSTRAINT "GrantSkill_grantId_fkey" FOREIGN KEY ("grantId") REFERENCES "Grant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantSkill" ADD CONSTRAINT "GrantSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
