-- CreateEnum
CREATE TYPE "PetitionStatus" AS ENUM ('ACTIVE', 'CLOSED', 'SUCCESSFUL');

-- CreateEnum
CREATE TYPE "EmailFrequency" AS ENUM ('INSTANT', 'DAILY', 'WEEKLY', 'NEVER');

-- CreateTable
CREATE TABLE "Petition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "imageUrl" TEXT,
    "targetCount" INTEGER NOT NULL DEFAULT 1000,
    "status" "PetitionStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT NOT NULL,
    "notifyOnComment" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnMilestone" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT,

    CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionSignature" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referrerId" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    "referralSource" TEXT,

    CONSTRAINT "PetitionSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "petitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PetitionComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionFollow" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifyOnComment" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnMilestone" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnUpdate" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnSignature" BOOLEAN NOT NULL DEFAULT false,
    "emailFrequency" "EmailFrequency" NOT NULL DEFAULT 'INSTANT',
    "lastEmailSent" TIMESTAMP(3),

    CONSTRAINT "PetitionFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionStatusUpdate" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetitionStatusUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionMilestone" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "reached" BOOLEAN NOT NULL DEFAULT false,
    "reachedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PetitionMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PetitionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PetitionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PetitionToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PetitionSignature_petitionId_userId_key" ON "PetitionSignature"("petitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionComment_petitionId_userId_key" ON "PetitionComment"("petitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionFollow_petitionId_userId_key" ON "PetitionFollow"("petitionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionCategory_name_key" ON "PetitionCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionCategory_slug_key" ON "PetitionCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionTag_name_key" ON "PetitionTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionTag_slug_key" ON "PetitionTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_PetitionToTags_AB_unique" ON "_PetitionToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_PetitionToTags_B_index" ON "_PetitionToTags"("B");

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PetitionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionSignature" ADD CONSTRAINT "PetitionSignature_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionSignature" ADD CONSTRAINT "PetitionSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionSignature" ADD CONSTRAINT "PetitionSignature_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionComment" ADD CONSTRAINT "PetitionComment_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionComment" ADD CONSTRAINT "PetitionComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionFollow" ADD CONSTRAINT "PetitionFollow_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionFollow" ADD CONSTRAINT "PetitionFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionStatusUpdate" ADD CONSTRAINT "PetitionStatusUpdate_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionMilestone" ADD CONSTRAINT "PetitionMilestone_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetitionToTags" ADD CONSTRAINT "_PetitionToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Petition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PetitionToTags" ADD CONSTRAINT "_PetitionToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "PetitionTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
