import { createOpenAI } from "@ai-sdk/openai"
import { ChatClient } from "./chat/client"
import { getRedisModelCache } from "@/lib/utils/redis"
import { Message } from "@/types/chat"

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  organization: process.env.OPENAI_ORG_ID,
})

interface ChatModelOptions {
  temperature?: number;
  modelName?: string;
  cache?: any;
}

export function getChatOpenAIModel(modelName?: string) {
  const client = new ChatClient(process.env.OPENAI_API_KEY || "");
  
  return {
    call: async (messages: Message[]) => {
      const response = await client.createChatCompletion(messages, {
        messages,
        model: modelName || "gpt-3.5-turbo-0125",
        temperature: 0,
      });
      
      const cache = getRedisModelCache();
      
      return response.choices[0]?.message?.content || "";
    }
  };
}
