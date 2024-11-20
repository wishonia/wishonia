-- AlterTable
ALTER TABLE "Petition" ADD COLUMN     "callScript" TEXT,
ADD COLUMN     "messageTemplate" TEXT,
ADD COLUMN     "targetLocation" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "callScript" TEXT,
ADD COLUMN     "messageTemplate" TEXT,
ADD COLUMN     "targetLocation" TEXT;

-- CreateTable
CREATE TABLE "Representative" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "office" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "party" TEXT,
    "phones" TEXT[],
    "emails" TEXT[],
    "photoUrl" TEXT,
    "urls" TEXT[],
    "address" JSONB,
    "channels" JSONB,

    CONSTRAINT "Representative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionRepMessage" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "representativeId" TEXT NOT NULL,
    "messageTemplate" TEXT NOT NULL,
    "callScript" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "PetitionRepMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PetitionRepMessage" ADD CONSTRAINT "PetitionRepMessage_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionRepMessage" ADD CONSTRAINT "PetitionRepMessage_representativeId_fkey" FOREIGN KEY ("representativeId") REFERENCES "Representative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionRepMessage" ADD CONSTRAINT "PetitionRepMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
