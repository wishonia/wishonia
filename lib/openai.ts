import { createOpenAI } from '@ai-sdk/openai'
import {embed} from "ai";
import { prisma } from '@/lib/db';
import {EmbeddingModelV1Embedding} from "@ai-sdk/provider";
import {GlobalProblem, GlobalSolution} from "@prisma/client";
import {ChatOpenAI} from "@langchain/openai";
import {getRedisModelCache} from "@/lib/utils/redis";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  organization: process.env.OPENAI_ORG_ID,
})

export async function generateOpenAIEmbeddings(_input: string){
  // OpenAI API requires input to be a single line
  const input = _input.replace(/\n/g, ' ')
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-ada-002'),
    value: input,
  })
  return embedding;
}

export async function saveEmbedding(embedding: EmbeddingModelV1Embedding, table: string, id: string){
  // await prisma.$executeRaw`
  //       UPDATE ${table}
  //       SET embedding = ${embedding}::vector
  //       WHERE id = ${id}
  //   `
  const embeddingStr = embedding.join(', ');
  const query = `
    UPDATE ${table}
    SET embedding = ARRAY[${embeddingStr}]::float[]
    WHERE id = $1
  `;
  await prisma.$executeRawUnsafe(query, id);
}

export async function generateAndSaveEmbedding(input: string, table: string, id: string){
  const embedding = await generateOpenAIEmbeddings(input);
  await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
  await saveEmbedding(embedding, table, id);
}

export async function searchByEmbedding(
    query: string,
    table: "GlobalProblem" | "GlobalSolution", // Add more tables here
): Promise<Array<GlobalProblem | GlobalSolution & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return []

    const embedding = await generateOpenAIEmbeddings(query)
    const vectorQuery = `[${embedding.join(',')}]`
    const matches = await prisma.$queryRaw`
      SELECT
        id,
        "name",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM ${table}
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 8;
    `

    return matches as Array<GlobalProblem | GlobalSolution & { similarity: number }>
  } catch (error) {
    console.error(error)
    throw error
  }
}

export function getChatOpenAIModel(modelName?: string) {
  return new ChatOpenAI({
    temperature: 0,
    modelName: modelName || "gpt-3.5-turbo-0125",
    cache: getRedisModelCache()
  });
}