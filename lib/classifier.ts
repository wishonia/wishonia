import { ChatPromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"

import { getChatOpenAIModel } from "@/lib/openai"

/**
 * Classify a given text based on provided enumerated options
 * @param input The text to classify.
 * @param options The possible classifications.
 *                  i.e. ["positive", "negative", "neutral"]
 * @param description The description of the classification.
 *                      i.e. "The sentiment of the text."
 * @returns The classification of the text.
 */
export async function classifyText(
  input: string,
  options: string[],
  description: string
): Promise<string> {
  const classificationSchema = z.object({
    classification: z
      .enum(options as [string, ...string[]])
      .describe(description),
  })
  const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Extract the desired information from the following passage.

Only extract the properties mentioned in the 'Classification' function.

Text to Classify:
{input}
`
  )
  const llm = getChatOpenAIModel()
  const llmWihStructuredOutput = llm.withStructuredOutput(
    classificationSchema,
    {
      name: "extractor",
    }
  )
  const chain = taggingPrompt.pipe(llmWihStructuredOutput)
  const obj = await chain.invoke({ input })
  return obj.classification
}
