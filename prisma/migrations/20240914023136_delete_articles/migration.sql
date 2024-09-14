-- DropForeignKey
ALTER TABLE "ArticleGenerationOptions" DROP CONSTRAINT "ArticleGenerationOptions_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSearchResult" DROP CONSTRAINT "ArticleSearchResult_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleSource" DROP CONSTRAINT "ArticleSource_articleId_fkey";

-- AddForeignKey
ALTER TABLE "ArticleSource" ADD CONSTRAINT "ArticleSource_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleSearchResult" ADD CONSTRAINT "ArticleSearchResult_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleGenerationOptions" ADD CONSTRAINT "ArticleGenerationOptions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
