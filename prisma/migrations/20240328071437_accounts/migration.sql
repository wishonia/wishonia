-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginToken" TEXT,
ADD COLUMN     "tokenExpires" TIMESTAMP(3);
