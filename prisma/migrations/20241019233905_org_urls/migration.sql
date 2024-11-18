/*
  Warnings:

  - Made the column `url` on table `Organization` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "alternateUrls" TEXT[],
ALTER COLUMN "url" SET NOT NULL;
