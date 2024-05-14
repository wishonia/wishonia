/*
  Warnings:

  - You are about to drop the column `description` on the `wishing_well_pair_allocations` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `wishing_well_pair_allocations` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `wishing_well_pair_allocations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishing_well_pair_allocations" DROP COLUMN "description",
DROP COLUMN "subtitle",
DROP COLUMN "title";
