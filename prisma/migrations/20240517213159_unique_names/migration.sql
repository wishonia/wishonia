/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `global_problems` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `wishing_wells` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "global_problems_name_key" ON "global_problems"("name");

-- CreateIndex
CREATE UNIQUE INDEX "wishing_wells_name_key" ON "wishing_wells"("name");
