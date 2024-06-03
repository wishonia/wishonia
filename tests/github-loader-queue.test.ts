/**
 * @jest-environment node
 */
import { QSource } from "@/types";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WishoniaVectorStore } from "@/lib/utils/store";
import { embeddings } from "@/lib/utils/embeddings";
import { Github } from "@/lib/loaders/github";
import { PrismaClient } from "@prisma/client";
import { getModelInfo } from "@/lib/utils/get-model-info";

describe("githubQueueController", () => {
    let prisma: PrismaClient;
    let source: QSource;

    beforeAll(async () => {
        prisma = new PrismaClient();
        source = {
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
            type: "github",
            location: "",
            isPending: true,
            id: "test-source-id",
            agentId: "test-agent-id",
            content: "https://github.com/wishonia/wishonia",
            chunkSize: 1000,
            chunkOverlap: 200,
            embedding: "test-embedding-id",
            options: JSON.stringify({
                branch: "main",
                is_private: false,
            }),
        };
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should load and process GitHub repository", async () => {
        const loader = new Github({
            branch: JSON.parse(source.options).branch,
            url: source.content!,
            is_private: JSON.parse(source.options).is_private,
        });
        const docs = await loader.load();

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: source.chunkSize,
            chunkOverlap: source.chunkOverlap,
        });
        const chunks = await textSplitter.splitDocuments(docs);

        const embeddingInfo = await getModelInfo({
            model: source.embedding,
            prisma,
            type: "embedding",
        });

        expect(embeddingInfo).toBeDefined();

        const vectorStore = await WishoniaVectorStore.fromDocuments(
            chunks,
            embeddings(
                embeddingInfo!.modelProvider!.toLowerCase(),
                embeddingInfo!.modelId,
                embeddingInfo?.config
            ),
            {
                agentId: source.agentId,
                sourceId: source.id,
            }
        );

        expect(vectorStore).toBeDefined();
        expect(vectorStore.agentId).toBe(source.agentId);
        expect(vectorStore.sourceId).toBe(source.id);
    });
});