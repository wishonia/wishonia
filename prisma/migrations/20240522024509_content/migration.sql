/*
  Warnings:

  - You are about to drop the column `long_description` on the `wishing_wells` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishing_wells" DROP COLUMN "long_description",
ADD COLUMN     "content" TEXT;
