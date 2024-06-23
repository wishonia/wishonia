import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {OpenAIEmbeddings} from "@langchain/openai";
import {getPostgresClient, getPostgresConfig} from "@/lib/db/postgresClient";
import {index} from "@langchain/core/indexing";
import {BaseDocumentLoader} from "@langchain/core/dist/document_loaders/base";
import {DocumentInterface} from "@langchain/core/dist/documents/document";
import {PostgresRecordManager} from "@langchain/community/dist/indexes/postgres";
function getPgVectorStore(dataSourceId: string) {
    return new PGVectorStore(new OpenAIEmbeddings(), {
        pool: getPostgresClient(),
        tableName: "vector_table_langchain",
        collectionTableName: "vector_collection_table_langchain",
        collectionName: `vector_collection_langchain_${dataSourceId}`,
        columns: {
            idColumnName: "id",
            vectorColumnName: "vector",
            contentColumnName: "content",
            metadataColumnName: "metadata",
        },
    });
}

async function getRecordManager(namespace?: string) {
// Create a new record manager
    const recordManagerConfig = {
        postgresConnectionOptions: getPostgresConfig(),
        tableName: "vector_upsertion_records",
    };
    const recordManager = new PostgresRecordManager(
        namespace || "vector_record_manager_namespace",
        recordManagerConfig
    );

// Create the schema if it doesn't exist
    await recordManager.createSchema();
    return recordManager;
}

/**
 * Hacky helper method to clear content. See the `full` mode section to to understand why it works.
 */
async function clearVectorDB(dataSourceId: string) {
    const vectorStore = getPgVectorStore(dataSourceId);
    const recordManager = await getRecordManager();
    await index({
        docsSource: [],
        recordManager,
        vectorStore,
        options: {
            cleanup: "full",
            sourceIdKey: "source",
        },
    });
}

export async function indexDocuments(docs: BaseDocumentLoader | DocumentInterface[], dataSourceId: string) {
    const vectorStore = getPgVectorStore(dataSourceId);
    const recordManager = await getRecordManager();
    return index({
        docsSource: docs,
        recordManager,
        vectorStore,
        options: {
            cleanup: "incremental",
            sourceIdKey: "source",
        },
    });
}

export async function getSimilarDocuments(query: string, dataSourceId: string) {
    const vectorStore = getPgVectorStore(dataSourceId);
    return vectorStore.similaritySearch(query, 10);
}