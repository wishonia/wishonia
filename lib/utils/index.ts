import { anthropic } from "@ai-sdk/anthropic"
import { createAzure } from "@ai-sdk/azure"
import { google } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createOllama } from "ollama-ai-provider"

export function getModel(useSubModel = false) {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL + "/api"
  const ollamaModel = process.env.OLLAMA_MODEL
  const ollamaSubModel = process.env.OLLAMA_SUB_MODEL
  const openaiApiBase = process.env.OPENAI_API_BASE
  const openaiApiKey = process.env.OPENAI_API_KEY
  let openaiApiModel = process.env.OPENAI_API_MODEL || "gpt-4o"
  const azureResourceName = process.env.AZURE_RESOURCE_NAME
  const azureApiKey = process.env.AZURE_API_KEY
  let azureDeploymentName = process.env.AZURE_DEPLOYMENT_NAME || "gpt-4o"
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY
  const groqApiKey = process.env.GROQ_API_KEY
  const groqApiModel = process.env.GROQ_API_MODEL

  if (
    !(ollamaBaseUrl && ollamaModel) &&
    !openaiApiKey &&
    !googleApiKey &&
    !anthropicApiKey &&
    !(azureApiKey && azureResourceName)
  ) {
    throw new Error(
      "Missing environment variables for Ollama, OpenAI, Azure OpenAI, Google or Anthropic"
    )
  }
  // Ollama
  if (ollamaBaseUrl && ollamaModel) {
    const ollama = createOllama({ baseURL: ollamaBaseUrl })

    if (useSubModel && ollamaSubModel) {
      return ollama(ollamaSubModel)
    }

    return ollama(ollamaModel)
  }

  if (googleApiKey) {
    return google("gemini-1.5-pro-002")
  }

  if (anthropicApiKey) {
    return anthropic("claude-3-5-sonnet-20240620")
  }

  if (azureApiKey && azureResourceName) {
    const azure = createAzure({
      apiKey: azureApiKey,
      resourceName: azureResourceName,
    })

    return azure.chat(azureDeploymentName)
  }

  if (groqApiKey && groqApiModel) {
    const groq = createOpenAI({
      apiKey: groqApiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })

    return groq.chat(groqApiModel)
  }

  // Fallback to OpenAI instead
  const openai = createOpenAI({
    baseURL: openaiApiBase, // optional base URL for proxies etc.
    apiKey: openaiApiKey, // optional API key, default to env property OPENAI_API_KEY
    organization: "", // optional organization
  })

  return openai.chat(openaiApiModel)
}

/**
 * Sanitizes a URL by replacing spaces with '%20'
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, "%20")
}
