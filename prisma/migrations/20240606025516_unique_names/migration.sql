/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `GlobalProblemSolution` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[description]` on the table `GlobalProblemSolution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `GlobalProblemSolution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalProblemSolution" ADD COLUMN     "content" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblemSolution_name_key" ON "GlobalProblemSolution"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalProblemSolution_description_key" ON "GlobalProblemSolution"("description");
