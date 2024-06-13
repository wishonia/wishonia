-- CreateTable
CREATE TABLE "GlobalProblemSolutionPairAllocation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "thisGlobalProblemSolutionId" TEXT NOT NULL,
    "thatGlobalProblemSolutionId" TEXT NOT NULL,
    "thisGlobalProblemSolutionPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalProblemSolutionPairAllocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GlobalProblemSolutionPairAllocation" ADD CONSTRAINT "GlobalProblemSolutionPairAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemSolutionPairAllocation" ADD CONSTRAINT "GlobalProblemSolutionPairAllocation_thisGlobalProblemSolut_fkey" FOREIGN KEY ("thisGlobalProblemSolutionId") REFERENCES "GlobalProblemSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalProblemSolutionPairAllocation" ADD CONSTRAINT "GlobalProblemSolutionPairAllocation_thatGlobalProblemSolut_fkey" FOREIGN KEY ("thatGlobalProblemSolutionId") REFERENCES "GlobalProblemSolution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
