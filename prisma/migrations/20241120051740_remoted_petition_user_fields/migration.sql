/*
  Warnings:

  - You are about to drop the column `callScript` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `messageTemplate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `targetLocation` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "callScript",
DROP COLUMN "messageTemplate",
DROP COLUMN "targetLocation";
