import { Document } from "@langchain/core/documents";
import { Embeddings } from "@langchain/core/embeddings";
import { VectorStore } from "@langchain/core/vectorstores";
import { prisma } from "../db";
import {createHash} from "crypto";

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
    try {
      for (let i = 0; i < vectors.length; i++) {
        const embedding = vectors[i];
        const document = documents[i];
        const content = document.pageContent.replace(/\x00/g, "").trim();
        const metadata = JSON.stringify(document.metadata);
        const vector = `[${embedding.join(",")}]`;
        let path = document.metadata?.path || document.metadata?.filename || document.metadata?.source || `${this.datasourceId}_${Date.now()}_${i}`;
        const checksum = createHash('sha256').update(document.pageContent).digest('base64');
        let datasourcePage = await prisma.datasourcePage.findUnique({
            where: { path },
          });

      if(!datasourcePage) {
        // Create DatasourcePage
        datasourcePage = await prisma.datasourcePage.create({
          data: {
            path,
            type: 'vector',
            source: 'WishoniaVectorStore',
            meta: document.metadata,
            version: '1.0',
            datasourceId: this.datasourceId,
          },
        });
      }


        // Insert into DatasourcePageSection using raw SQL
        await prisma.$executeRaw`
          INSERT INTO "DatasourcePageSection" ("id", "content", "embedding", "datasourcePageId")
          VALUES (${datasourcePage.id}, ${content}, ${vector}::vector, ${datasourcePage.id})
        `;
      }
    } catch (e) {
      console.error("Error in addVectors:", e);
      throw e;
    }
  }

  async addDocuments(documents: Document[]): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    const embeddings = await this.embeddings.embedDocuments(texts);
    return this.addVectors(embeddings, documents);
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

  static async fromExistingIndex(
      embeddings: Embeddings,
      dbConfig: WishoniaLibArgs
  ) {
    return new this(embeddings, dbConfig);
  }

  async similaritySearchVectorWithScore(
      query: number[],
      k: number,
      filter?: this["FilterType"] | undefined
  ): Promise<[Document<Record<string, any>>, number][]> {
    if (!query) {
      return [];
    }
    const vector = `[${query?.join(",")}]`;

    const match_count = k;
    const semanticSearchSimilarityScore = 0;

    const data = await prisma.$queryRaw`
      SELECT 
        dps.id,
        dps.content,
        dp.meta as metadata,
        1 - (dps.embedding <=> ${vector}::vector) as similarity
      FROM "DatasourcePageSection" dps
      JOIN "DatasourcePage" dp ON dps."datasourcePageId" = dp.id
      WHERE dp."datasourceId" = ${this.datasourceId}
      ORDER BY similarity DESC
      LIMIT ${match_count}
    `;

    const result: [Document, number][] = (
        data as SearchEmbeddingsResponse[]
    ).map((resp) => [
      new Document({
        metadata: resp.metadata,
        pageContent: resp.content,
      }),
      resp.similarity,
    ]);

    return result.filter(
        ([, similarity]) => similarity >= semanticSearchSimilarityScore
    );
  }

  _vectorstoreType(): string {
    return "wishonia";
  }
}