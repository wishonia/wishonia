-- DropForeignKey
ALTER TABLE "OrganizationSkill" DROP CONSTRAINT "OrganizationSkill_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "OrganizationSkill" ADD CONSTRAINT "OrganizationSkill_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
