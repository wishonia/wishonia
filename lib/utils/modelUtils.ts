import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { LanguageModelV1 } from "@ai-sdk/provider";

export const DEFAULT_MODEL_NAME =
    //'gpt-4o-mini';
    //'gpt-4-turbo';
    //'gemini-1.5-pro';
    'claude-3-5-sonnet-20240620';
export type ModelName = 'claude-3-5-sonnet-20240620' | 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' |
    'gpt-4o' | 'gpt-4o-2024-05-13' | 'gpt-4o-2024-08-06' | 'gpt-4o-mini' | 'gpt-4o-mini-2024-07-18' | 'gpt-4-turbo' | 'gpt-4-turbo-2024-04-09' | 'gpt-4-turbo-preview' | 'gpt-4-0125-preview' | 'gpt-4-1106-preview' | 'gpt-4' | 'gpt-4-0613' | 'gpt-3.5-turbo-0125' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' |
    'gemini-1.5-flash-latest' | 'gemini-1.5-flash' | 'gemini-1.5-pro-latest' | 'gemini-1.5-pro' | 'gemini-1.0-pro';


export function getModel(modelName: ModelName = DEFAULT_MODEL_NAME): LanguageModelV1 {
  console.log(`🤖 Using AI model: ${modelName}`);
  
  if (modelName.includes("claude")) {
    return anthropic(modelName)
  }
  if (modelName.includes("gpt")) {
    return openai(modelName)
  }
  if (modelName.includes("gemini")) {
    return google("models/" + modelName, {
      topK: 0,
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE",
        },
      ],
    })
  }
  return anthropic(DEFAULT_MODEL_NAME) // Default model
}
