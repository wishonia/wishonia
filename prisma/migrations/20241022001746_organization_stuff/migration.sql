/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telephone]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[linkedinUrl]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[twitterHandle]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebookPage]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instagramHandle]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[youtubeChannel]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stockSymbol]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,foundedYear]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('PUBLIC', 'PRIVATE', 'NONPROFIT', 'GOVERNMENT', 'EDUCATIONAL');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "companySize" "CompanySize",
ADD COLUMN     "companyType" "CompanyType",
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "facebookPage" TEXT,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "headquartersLocation" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "instagramHandle" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "publiclyTraded" BOOLEAN DEFAULT false,
ADD COLUMN     "revenue" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "specialties" TEXT[],
ADD COLUMN     "stockSymbol" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "twitterHandle" TEXT,
ADD COLUMN     "youtubeChannel" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrganizationLocation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "isHeadquarters" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationFollower" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationFollower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "referralUrl" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "referralUrl" TEXT,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "location" TEXT,
    "organizationId" TEXT NOT NULL,
    "url" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "maxParticipants" INTEGER,
    "registrationRequired" BOOLEAN NOT NULL DEFAULT false,
    "registrationUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partnership" (
    "id" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationFollower_organizationId_userId_key" ON "OrganizationFollower"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_organizationId_key" ON "Product"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_organizationId_key" ON "Service"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_organizationId_startDate_key" ON "Event"("name", "organizationId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_partnerName_organizationId_startDate_key" ON "Partnership"("partnerName", "organizationId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_email_key" ON "Organization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_telephone_key" ON "Organization"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_linkedinUrl_key" ON "Organization"("linkedinUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_twitterHandle_key" ON "Organization"("twitterHandle");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_facebookPage_key" ON "Organization"("facebookPage");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_instagramHandle_key" ON "Organization"("instagramHandle");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_youtubeChannel_key" ON "Organization"("youtubeChannel");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_stockSymbol_key" ON "Organization"("stockSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_foundedYear_key" ON "Organization"("name", "foundedYear");

-- AddForeignKey
ALTER TABLE "OrganizationLocation" ADD CONSTRAINT "OrganizationLocation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFollower" ADD CONSTRAINT "OrganizationFollower_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationFollower" ADD CONSTRAINT "OrganizationFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partnership" ADD CONSTRAINT "Partnership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
