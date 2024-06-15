import axios from "axios";
import {PromptTemplate} from "@langchain/core/prompts";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {ChatOllama} from "@langchain/community/chat_models/ollama";
import {BaseChatModelParams} from "@langchain/core/language_models/chat_models";
// @ts-ignore
import {OllamaInput} from "@langchain/community/dist/utils/ollama";

export const cleanUrl = (url: string) => {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};

export const getAllOllamaModels = async (url: string) => {
  try {
    const response = await axios.get(`${cleanUrl(url)}/api/tags`);
    const { models } = response.data as {
      models: {
        name: string;
        details?: {
            parent_model?: string
            format: string
            family: string
            families: string[]
            parameter_size: string
            quantization_level: string
          }
      }[];
    };
    return models.map((data) => {
      return {
        ...data,
        label: data.name,
        value: data.name,
        stream: true
      };
    });
  } catch (error) {
    console.log(`Error fetching Ollama models`, error);
    return [];
  }
};
export async function talkToOllama(input: string) {
  const ollama = new ChatOllama({
    model: getModel(),
    baseUrl: getBaseUrl()
  });
  const result = await ollama.invoke(input);
  console.log({ result });
  return result;
}

function getBaseUrl() {
  return process.env.OLLAMA_URL || "http://localhost:11434";
}

function getModel() {
  return process.env.OLLAMA_MODEL || "llama3";
}

function getChatOllamaInstance(fields?: OllamaInput & BaseChatModelParams) {
    if(!fields) fields = {};
    if(!fields.model) fields.model = getModel();
    if(!fields.baseUrl) fields.baseUrl = getBaseUrl();
    return new ChatOllama(fields);
}

export async function ollamaJson(input: string) {
  const TEMPLATE = `
  All responses must be in JSON format, 
  with a property named "response" followed by the value.

  User: {input}
  AI:`;
  // Infer the input variables from the template
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const ollama = getChatOllamaInstance({
      format: "json",
  });
  const outputParser = new StringOutputParser();
  const chain = prompt.pipe(ollama).pipe(outputParser);
  return await chain.invoke({
    input,
  });
}

export async function ollamaClassify(input: string, options: string[]): Promise<string> {
    const TEMPLATE = `
    Classify the input text into one of the following categories: ${options.join(", ")}.
    Only the category name should be returned.
    
    User: {input}
    AI:`;
    // Infer the input variables from the template
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const ollama = getChatOllamaInstance();
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(ollama).pipe(outputParser);
    return await chain.invoke({
        input,
    });
}