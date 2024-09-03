import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import Exa from "exa-js"
import { z } from "zod"
const exa = new Exa(process.env.EXA_API_KEY);

const SideEffectSchema = z.object({
    effect: z.string(),
    frequency: z.string(),
    severity: z.string().optional(),
    notes: z.string().optional(),
});

const SideEffectArraySchema = z.array(SideEffectSchema);

const SideEffectsSchema = z.object({
  sideEffects: SideEffectArraySchema
});

async function getSearchResults(query: string, linksPerQuery: number = 5): Promise<{ url: string; text: string; }[]> {
    const searchResponse = await exa.searchAndContents(query, {
        numResults: linksPerQuery,
        useAutoprompt: false,
    });
    return searchResponse.results;
}

export async function generateSideEffects(drugName: string): Promise<z.infer<typeof SideEffectArraySchema>> {
    const query = `side effects and frequencies of ${drugName}`;
    const searchResults = await getSearchResults(query, 1);
    const searchResultsText = searchResults.map(r => r.text).join('\n\n');

    const prompt = `Analyze the following information and create a list of side effects for ${drugName}. 
  For each side effect, include:
  1. The effect name
  2. Its frequency (e.g., common, rare, 1 in 1000)
  3. Severity (if available)
  4. Any additional notes

  Format the output as a JSON array of objects, each containing 'effect', 'frequency', 'severity' (optional), and 'notes' (optional) fields.

  The following info from this search may contain useful reference data for generating the side effects list:
${searchResultsText}
  `;

    const result = await generateObject({
        model: anthropic('claude-3-5-sonnet-20240620'),
        schema: SideEffectsSchema,
        prompt,
    });

    return result.object.sideEffects;
}