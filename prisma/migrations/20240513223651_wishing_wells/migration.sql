/*
  Warnings:

  - You are about to drop the column `background_color` on the `wishing_wells` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `wishing_wells` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "wishing_wells" DROP COLUMN "background_color",
DROP COLUMN "label",
ADD COLUMN     "featured_image" TEXT[];

-- CreateTable
CREATE TABLE "global_problems" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "featured_image" TEXT[],
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_problem_pair_allocations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "this_global_problem_id" TEXT NOT NULL,
    "that_global_problem_id" TEXT NOT NULL,
    "this_global_problem_percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_problem_pair_allocations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "global_problems" ADD CONSTRAINT "global_problems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_problem_pair_allocations" ADD CONSTRAINT "global_problem_pair_allocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_problem_pair_allocations" ADD CONSTRAINT "global_problem_pair_allocations_this_global_problem_id_fkey" FOREIGN KEY ("this_global_problem_id") REFERENCES "global_problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_problem_pair_allocations" ADD CONSTRAINT "global_problem_pair_allocations_that_global_problem_id_fkey" FOREIGN KEY ("that_global_problem_id") REFERENCES "global_problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
