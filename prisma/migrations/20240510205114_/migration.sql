/*
  Warnings:

  - Added the required column `description` to the `wishing_well_pair_allocations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `wishing_well_pair_allocations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `wishing_well_pair_allocations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wishing_well_pair_allocations" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wishing_wells" ADD COLUMN     "background_color" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "label" TEXT,
ADD COLUMN     "long_description" TEXT;

-- AddForeignKey
ALTER TABLE "wishing_well_pair_allocations" ADD CONSTRAINT "wishing_well_pair_allocations_this_wishing_well_id_fkey" FOREIGN KEY ("this_wishing_well_id") REFERENCES "wishing_wells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishing_well_pair_allocations" ADD CONSTRAINT "wishing_well_pair_allocations_that_wishing_well_id_fkey" FOREIGN KEY ("that_wishing_well_id") REFERENCES "wishing_wells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
