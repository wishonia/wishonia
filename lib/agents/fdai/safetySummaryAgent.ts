import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import Exa from "exa-js"
import { z } from "zod"
import {generateSearchQueries} from "@/lib/agents/fdai/searchQueryGenerator";

const exa = new Exa(process.env.EXA_API_KEY);

const SafetyRatingSchema = z.enum(['Low', 'Moderate', 'High'])
  .describe('The overall safety rating of the drug');

const SafetySummarySchema = z.object({
    drugName: z.string()
      .describe('Name of the drug'),
    conditionName: z.string().optional()
      .describe('Specific condition for which the safety is being described (if applicable)'),
    overallSafetyRating: SafetyRatingSchema,
    shortSummary: z.string()
      .describe('A brief overview of the drug\'s safety profile'),
    keyFindings: z.array(z.string())
      .describe('Main safety-related discoveries or conclusions'),
    riskFactors: z.array(z.string())
      .describe('Factors that may increase the risk of adverse effects'),
    precautions: z.array(z.string())
      .describe('Measures to be taken to ensure safe use of the drug'),
    contraindications: z.array(z.string())
      .describe('Conditions or factors that serve as a reason to withhold the drug'),
    longTermSafetyConsiderations: z.string()
      .describe('Safety concerns related to long-term use of the drug'),
    specialPopulations: z.object({
        pregnancy: z.string()
          .describe('Safety considerations for use during pregnancy'),
        elderly: z.string()
          .describe('Safety considerations for use in elderly patients'),
        children: z.string()
          .describe('Safety considerations for use in pediatric patients'),
        otherGroups: z.array(z.object({
            group: z.string()
              .describe('Name of the special population group'),
            considerations: z.string()
              .describe('Safety considerations specific to this group')
        }))
          .describe('Safety considerations for other specific populations')
    })
      .describe('Safety information for specific patient groups'),
    drugInteractions: z.array(z.object({
        drug: z.string()
          .describe('Name of the interacting drug'),
        interaction: z.string()
          .describe('Description of the interaction'),
        severity: SafetyRatingSchema
          .describe('Severity of the interaction')
    }))
      .describe('Known interactions with other drugs'),
    referenceSources: z.array(z.string())
      .describe('Sources of information used in compiling this safety summary')
});

const SafetySummaryResponseSchema = z.object({
    safetySummary: SafetySummarySchema
}).describe('The complete safety summary response object');

export type SafetySummary = z.infer<typeof SafetySummarySchema>;

async function getSearchResults(query: string, linksPerQuery: number = 5): Promise<{ url: string; text: string; }[]> {
    const searchResponse = await exa.searchAndContents(query, {
        numResults: linksPerQuery,
        useAutoprompt: false,
    });
    return searchResponse.results;
}

export async function generateSafetySummary(drugName: string, conditionName?: string): Promise<SafetySummary> {
    const topic = conditionName 
        ? `safety of ${drugName} for treating ${conditionName}`
        : `general safety profile of ${drugName}`;
    
    const queries = await generateSearchQueries(topic, 1);
    const allSearchResults = await Promise.all(queries.map(query => getSearchResults(query, 3)));
    const searchResultsText = allSearchResults.flat().map(r => r.text).join('\n\n');

    const prompt = `Based on the following information, create a detailed safety summary for ${drugName}${conditionName ? ` when used for treating ${conditionName}` : ''}. 
    
    Ensure all fields are filled with accurate, well-supported information. Include key findings, risk factors, precautions, contraindications, long-term safety considerations, special population considerations (including pregnancy, elderly, and children), drug interactions, and reference sources.
    
    ${conditionName ? `Pay special attention to any safety considerations specific to using ${drugName} for treating ${conditionName}.` : 'Provide a general safety profile that applies across all approved uses of the drug.'}

    The following info from the search may contain useful reference data for generating the safety summary:
    ${searchResultsText}
    `;

    const result = await generateObject({
        model: anthropic('claude-3-5-sonnet-20240620'),
        schema: SafetySummaryResponseSchema,
        prompt,
    });

    return result.object.safetySummary;
}