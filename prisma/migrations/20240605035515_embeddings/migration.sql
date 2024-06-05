-- AlterTable
ALTER TABLE "GenieDAO" ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "GlobalProblem" ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "GlobalSolution" ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "GlobalTask" ADD COLUMN     "embedding" vector(1536);

-- AlterTable
ALTER TABLE "WishingWell" ADD COLUMN     "embedding" vector(1536);
