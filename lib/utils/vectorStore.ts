import {Document} from "@langchain/core/documents";
import {Embeddings} from "@langchain/core/embeddings";
import {VectorStore} from "@langchain/core/vectorstores";
import {PostgresRecordManager} from "@langchain/community/indexes/postgres";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {OpenAIEmbeddings} from "@langchain/openai";
import {index} from "@langchain/core/indexing";
import {getPostgresConfig} from "@/lib/db/postgresClient";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";

export interface WishoniaLibArgs {
  //agentId: string;
  datasourceId: string;
}

interface SearchEmbeddingsResponse {
  id: string;
  content: string;
  metadata: object;
  similarity: number;
}

export class WishoniaVectorStore extends VectorStore {
  //agentId: string;
  datasourceId: string;
  declare embeddings: Embeddings;

  constructor(embeddings: Embeddings, args: WishoniaLibArgs) {
    super(embeddings, args);
    //this.agentId = args.agentId;
    this.datasourceId = args.datasourceId;
    this.embeddings = embeddings;
  }

  async addVectors(vectors: number[][], documents: Document[]): Promise<void> {
      throw new Error(`Use index() in addDocuments() instead`);
  }

  async addDocuments(documents: Document[]): Promise<void> {
    const vectorStore = await this.getVectorStore();
    // https://js.langchain.com/v0.2/docs/how_to/indexing
    const recordManagerConfig = {
      postgresConnectionOptions: getPostgresConfig(),
      tableName: "DocumentsUpsertionRecords",
    };
    const recordManager = new PostgresRecordManager(
        //Use a namespace that takes into account both the vector store and
        // the collection name in the vector store;
        // e.g., 'redis/my_docs', 'chromadb/my_docs' or 'postgres/my_docs'.
        this._vectorstoreType()+"/"+this.datasourceId,
        recordManagerConfig
    );

    // Create the schema if it doesn't exist
    await recordManager.createSchema();

    const result = await index({
      docsSource: documents,
      recordManager,
      vectorStore,
      options: {
        cleanup: undefined,
        sourceIdKey: "source",
      },
    })
    console.log(`Indexed ${result} documents. Result: `, result);
  }

  private async getVectorStore() {
    const config = {
      postgresConnectionOptions: getPostgresConfig(),
      tableName: "datasource_documents",
      collectionName: this.datasourceId,
      collectionTableName: "document_collections",
      columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
      },
    };

    return await PGVectorStore.initialize(
        new OpenAIEmbeddings(),
        config
    );
  }

  static async fromDocuments(
      docs: Document[],
      embeddings: Embeddings,
      dbConfig: WishoniaLibArgs
  ) {
    const instance = new this(embeddings, dbConfig);
    await instance.addDocuments(docs);
    return instance;
  }

  static async fromTexts(
      texts: string[],
      metadatas: object[] | object,
      embeddings: Embeddings,
      dbConfig: WishoniaLibArgs
  ) {
    const docs = [];
    for (let i = 0; i < texts.length; i += 1) {
      const metadata = Array.isArray(metadatas) ? metadatas[i] : metadatas;
      const newDoc = new Document({
        pageContent: texts[i],
        metadata,
      });
      docs.push(newDoc);
    }
    return this.fromDocuments(docs, embeddings, dbConfig);
  }

  async similaritySearchVectorWithScore(
      query: number[],
      k: number,
      filter?: Record<string, unknown> | undefined
  ): Promise<[Document<Record<string, any>>, number][]> {
    if (!query) {
      return [];
    }
    const pgvectorStore = await this.getVectorStore();
    return await pgvectorStore.similaritySearchVectorWithScore(query, k, filter)
  }

  _vectorstoreType(): string {
    return "wishonia_postgres";
  }
}

export async function splitDocuments(documents: Document[] ): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(documents);
}