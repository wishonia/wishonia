-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- CreateTable
CREATE TABLE "datasource_documents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "content" TEXT,
    "metadata" JSONB,
    "vector" vector,
    "collection_id" UUID,

    CONSTRAINT "datasource_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_collections" (
    "uuid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR,
    "cmetadata" JSONB,

    CONSTRAINT "document_collections_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "document_upsertion_records" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "updated_at" DOUBLE PRECISION NOT NULL,
    "group_id" TEXT,

    CONSTRAINT "document_upsertion_records_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "idx_document_collections_name" ON "document_collections"("name");

-- CreateIndex
CREATE INDEX "group_id_index" ON "document_upsertion_records"("group_id");

-- CreateIndex
CREATE INDEX "key_index" ON "document_upsertion_records"("key");

-- CreateIndex
CREATE INDEX "namespace_index" ON "document_upsertion_records"("namespace");

-- CreateIndex
CREATE INDEX "updated_at_index" ON "document_upsertion_records"("updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "document_upsertion_records_key_namespace_key" ON "document_upsertion_records"("key", "namespace");

-- AddForeignKey
ALTER TABLE "datasource_documents" ADD CONSTRAINT "datasource_documents_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "document_collections"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
