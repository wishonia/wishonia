/*
  Warnings:

  - The values [LINK] on the enum `SharingLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SharingLevel_new" AS ENUM ('UNPUBLISHED_LINK', 'PUBLISHED', 'PRIVATE');
ALTER TABLE "Agent" ALTER COLUMN "sharingLevel" DROP DEFAULT;
ALTER TABLE "Agent" ALTER COLUMN "sharingLevel" TYPE "SharingLevel_new" USING ("sharingLevel"::text::"SharingLevel_new");
ALTER TYPE "SharingLevel" RENAME TO "SharingLevel_old";
ALTER TYPE "SharingLevel_new" RENAME TO "SharingLevel";
DROP TYPE "SharingLevel_old";
ALTER TABLE "Agent" ALTER COLUMN "sharingLevel" SET DEFAULT 'PRIVATE';
COMMIT;
