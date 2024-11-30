import { z } from "zod"
import { getChatOpenAIModel } from "@/lib/openai"
import { Message } from "@/types/chat"
import { MessageRole } from "@prisma/client"

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

  const systemPrompt = `You are a classification assistant. Your task is to classify the given text into one of the following options: ${options.join(", ")}.

Rules:
- Only respond with a JSON object containing a single "classification" field
- The classification must be one of the allowed options
- ${description}

Example response format:
{ "classification": "option1" }`;

  const userPrompt = `Text to classify:
${input}

Respond only with the JSON classification.`;

  const messages: Message[] = [
    { role: MessageRole.system, content: systemPrompt },
    { role: MessageRole.user, content: userPrompt }
  ];

  const llm = getChatOpenAIModel();
  const response = await llm.call(messages);
  
  try {
    // Parse the response as JSON
    const result = JSON.parse(response);
    // Validate against our schema
    const validated = classificationSchema.parse(result);
    return validated.classification;
  } catch (error) {
    throw new Error(`Failed to parse classification response: ${error}`);
  }
}
