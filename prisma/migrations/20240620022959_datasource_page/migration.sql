/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_datasourceId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_parentPageId_fkey";

-- DropForeignKey
ALTER TABLE "PageSection" DROP CONSTRAINT "PageSection_pageId_fkey";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "PageSection";

-- CreateTable
CREATE TABLE "DatasourcePage" (
    "id" TEXT NOT NULL,
    "checksum" TEXT,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "version" TEXT NOT NULL,
    "lastRefresh" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentPageId" TEXT,
    "datasourceId" TEXT,

    CONSTRAINT "DatasourcePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DatasourcePageSection" (
    "id" TEXT NOT NULL,
    "datasourcePageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "embedding" DOUBLE PRECISION[],

    CONSTRAINT "DatasourcePageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatasourcePage_path_key" ON "DatasourcePage"("path");

-- AddForeignKey
ALTER TABLE "DatasourcePage" ADD CONSTRAINT "DatasourcePage_parentPageId_fkey" FOREIGN KEY ("parentPageId") REFERENCES "DatasourcePage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasourcePage" ADD CONSTRAINT "DatasourcePage_datasourceId_fkey" FOREIGN KEY ("datasourceId") REFERENCES "Datasource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DatasourcePageSection" ADD CONSTRAINT "DatasourcePageSection_datasourcePageId_fkey" FOREIGN KEY ("datasourcePageId") REFERENCES "DatasourcePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
