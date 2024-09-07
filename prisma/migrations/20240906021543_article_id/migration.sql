/*
  Warnings:

  - The primary key for the `Article` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleGenerationOptions" DROP CONSTRAINT "ArticleGenerationOptions_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSearchResult" DROP CONSTRAINT "ArticleSearchResult_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSource" DROP CONSTRAINT "ArticleSource_articleId_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToArticleTag" DROP CONSTRAINT "_ArticleToArticleTag_A_fkey";

-- AlterTable
ALTER TABLE "Article" DROP CONSTRAINT "Article_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Article_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Article_id_seq";

-- AlterTable
ALTER TABLE "ArticleComment" ALTER COLUMN "articleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ArticleGenerationOptions" ALTER COLUMN "articleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ArticleSearchResult" ALTER COLUMN "articleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ArticleSource" ALTER COLUMN "articleId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ArticleToArticleTag" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ArticleSource" ADD CONSTRAINT "ArticleSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSearchResult" ADD CONSTRAINT "ArticleSearchResult_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleGenerationOptions" ADD CONSTRAINT "ArticleGenerationOptions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleComment" ADD CONSTRAINT "ArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToArticleTag" ADD CONSTRAINT "_ArticleToArticleTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
