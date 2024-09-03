import {generateObject, LanguageModel} from "ai"
import { z } from "zod"

const TreatmentSchema = z.object({
  name: z.string(),
  //type: z.string().optional().describe("The type of treatment (e.g., medication, therapy, lifestyle change) if known"),
});

const TreatmentArraySchema = z.array(TreatmentSchema);

const TreatmentsSchema = z.object({
  treatments: TreatmentArraySchema
});

async function generateNames(prompt: string, model: LanguageModel): Promise<string[]> {
  const result = await generateObject({
    model: model,
    schema: TreatmentsSchema,
    prompt,
  });
  return result.object.treatments.map((treatment: any) => treatment.name);
}

export async function generateTreatmentsByAlphabet(condition: string, model: LanguageModel
): Promise<string[]> {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let allTreatments: string[] = [];

  for (const letter of alphabet) {
    const result = await generateTreatmentsStartingWith(condition, letter, model);
    allTreatments = allTreatments.concat(result);
  }

  return allTreatments;
}

export async function generateTreatmentsStartingWith(condition: string, letter: string, model: LanguageModel
): Promise<string[]> {
  const prompt = `List all potential treatments for ${condition} that start with the letter "${letter}". 
    Include both pharmaceutical and non-pharmaceutical treatments if applicable.
    List as many as you possibly can.
    For each treatment, provide:
    1. The treatment name`;

  return await generateNames(prompt, model);
}

export async function generateMostEffectiveTreatments(condition: string, model: LanguageModel
): Promise<string[]> {
  const prompt = `List the potentially most effective treatments for "${condition}" `;

  return await generateNames(prompt, model);
}

export async function generateMostEffectiveUnapprovedTreatments(condition: string, model: LanguageModel
): Promise<string[]> {
  const prompt = `List the names of as many treatments for "${condition}" as you possibly can. 
  However, only list medical treatments that:
  1. Have not yet been approved by the FDA for the treatment of "${condition}"
  2. Have the potential to be more effective than the currently approved treatments for "${condition}"
  `;

  return await generateNames(prompt, model);
}