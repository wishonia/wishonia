/*
  Warnings:

  - A unique constraint covering the columns `[userId,promptedTopic]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_userId_promptedTopic_key" ON "Article"("userId", "promptedTopic");

-- CreateIndex
CREATE UNIQUE INDEX "Article_userId_title_key" ON "Article"("userId", "title");
