/*
  Warnings:

  - You are about to drop the column `images` on the `global_problems` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "global_problems" DROP COLUMN "images",
ALTER COLUMN "featured_image" DROP NOT NULL,
ALTER COLUMN "featured_image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "wishing_wells" ALTER COLUMN "featured_image" DROP NOT NULL,
ALTER COLUMN "featured_image" SET DATA TYPE TEXT;
