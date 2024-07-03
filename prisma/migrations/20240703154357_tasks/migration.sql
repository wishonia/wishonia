-- AlterTable
ALTER TABLE "GlobalTask" ADD COLUMN     "content" TEXT,
ADD COLUMN     "embedding" vector,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "priority" TEXT;
