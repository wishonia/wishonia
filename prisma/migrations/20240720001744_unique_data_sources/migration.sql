/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Datasource` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Datasource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SharingLevel" AS ENUM ('LINK', 'PUBLISHED', 'PRIVATE');

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "sharingLevel" "SharingLevel" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "Datasource" ALTER COLUMN "status" SET DEFAULT 'QUEUED';

-- CreateIndex
CREATE UNIQUE INDEX "Datasource_url_key" ON "Datasource"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Datasource_name_userId_key" ON "Datasource"("name", "userId");
