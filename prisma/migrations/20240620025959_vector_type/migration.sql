/*
  Warnings:

  - The `embedding` column on the `DatasourcePageSection` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DatasourcePageSection" DROP COLUMN "embedding",
ADD COLUMN     "embedding" vector(1536);
