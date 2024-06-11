-- AlterTable
ALTER TABLE "GlobalProblemSolutionPairAllocation" ADD COLUMN     "globalProblemId" TEXT;

-- AddForeignKey
ALTER TABLE "GlobalProblemSolutionPairAllocation" ADD CONSTRAINT "GlobalProblemSolutionPairAllocation_globalProblemId_fkey" FOREIGN KEY ("globalProblemId") REFERENCES "GlobalProblem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
