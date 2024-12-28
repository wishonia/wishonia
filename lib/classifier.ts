import { generateObject } from "ai"
import { z } from "zod"

import { getModel } from "@/lib/utils/modelUtils"

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

  const userPrompt = `Text to classify:
${input}

Classify this text into one of these options: ${options.join(", ")}.
${description}`;

  const result = await generateObject({
    model: getModel(),
    schema: classificationSchema,
    prompt: userPrompt,
  });

  return result.object.classification;
}
