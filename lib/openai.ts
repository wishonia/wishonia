import { createOpenAI } from '@ai-sdk/openai'
import {ChatOpenAI} from "@langchain/openai";
import {getRedisModelCache} from "@/lib/utils/redis";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  organization: process.env.OPENAI_ORG_ID,
})

export function getChatOpenAIModel(modelName?: string) {
  return new ChatOpenAI({
    temperature: 0,
    modelName: modelName || "gpt-3.5-turbo-0125",
    cache: getRedisModelCache()
  });
}