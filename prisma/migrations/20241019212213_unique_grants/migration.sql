/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Grant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `Grant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Grant_title_key" ON "Grant"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Grant_url_key" ON "Grant"("url");
