-- AlterTable
ALTER TABLE "User" ADD COLUMN     "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newsletterEmails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "unsubscribeFromAll" BOOLEAN NOT NULL DEFAULT false;
