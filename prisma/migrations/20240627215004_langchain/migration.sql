/*
  Warnings:

  - You are about to drop the `DatasourcePage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DatasourcePage" DROP CONSTRAINT "DatasourcePage_datasourceId_fkey";

-- DropTable
DROP TABLE "DatasourcePage";
