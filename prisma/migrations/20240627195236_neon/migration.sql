/*
  Warnings:

  - You are about to drop the column `parentPageId` on the `DatasourcePage` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `DatasourcePage` table. All the data in the column will be lost.
  - You are about to drop the `DatasourcePageSection` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `DatasourcePage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DatasourcePage" DROP CONSTRAINT "DatasourcePage_parentPageId_fkey";

-- DropForeignKey
ALTER TABLE "DatasourcePageSection" DROP CONSTRAINT "DatasourcePageSection_datasourcePageId_fkey";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "conversationStarters" TEXT[] DEFAULT ARRAY['What can you do?']::TEXT[],
ALTER COLUMN "initialMessage" SET DEFAULT 'Hello, how can I help you today?',
ALTER COLUMN "prompt" SET DEFAULT 'You are a helpful AI Assistant';

-- AlterTable
ALTER TABLE "DatasourcePage" DROP COLUMN "parentPageId",
DROP COLUMN "source",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "embedding" vector(1536),
ADD COLUMN     "tokenCount" INTEGER;

-- DropTable
DROP TABLE "DatasourcePageSection";
