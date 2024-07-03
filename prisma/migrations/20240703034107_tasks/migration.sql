-- AlterTable
ALTER TABLE "GlobalTask" ALTER COLUMN "complexity" DROP NOT NULL,
ALTER COLUMN "estimatedHours" DROP NOT NULL,
ALTER COLUMN "isAtomic" DROP NOT NULL;
