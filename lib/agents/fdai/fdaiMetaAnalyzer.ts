import { generateObject } from "ai";
import Exa from 'exa-js';
import { z } from "zod";

import { generateMetaAnalysisQuery } from '@/lib/meta-analysis/metaAnalysisQueries';
import {getModel} from "@/lib/utils/modelUtils";

const exa = new Exa(process.env.EXA_API_KEY);

const SafetyRatingEnum = z.enum(['Low', 'Moderate', 'High']);

const articleSchema = z.object({
  score: z.number(),
  title: z.string(),
  id: z.string().url(),
  url: z.string().url(),
  publishedDate: z.string().datetime(),
  author: z.string(),
  text: z.string(),
});

export type Article = z.infer<typeof articleSchema>;

const MetaAnalysisReportSchema = z.object({
  drugName: z.string().describe('Name of the drug'),
  conditionName: z.string().describe('Name of the condition being treated'),
  overallSafetyRating: SafetyRatingEnum.describe('The overall safety rating of the drug'),
  shortSafetySummary: z.string().describe('A brief overview of the drug\'s safety profile'),
  keyFindings: z.array(z.string()).describe('Main safety-related discoveries or conclusions'),
  riskFactors: z.array(z.string()).describe('Factors that may increase the risk of adverse effects'),
  precautions: z.array(z.string()).describe('Measures to be taken to ensure safe use of the drug'),
  contraindications: z.array(z.string()).describe('Conditions or factors that serve as a reason to withhold the drug'),
  longTermSafetyConsiderations: z.string().describe('Safety concerns related to long-term use of the drug'),
  pregnancySafety: z.string().describe('Safety considerations for use during pregnancy'),
  //elderlySafety: z.string().describe('Safety considerations for use in elderly patients'),
  childrenSafety: z.string().describe('Safety considerations for use in pediatric patients'),
  drugInteractions: z.array(z.object({
    drug: z.string().describe('Name of the interacting drug'),
    interaction: z.string().describe('Description of the interaction'),
    severity: SafetyRatingEnum.describe('Severity of the interaction')
  })).describe('Known interactions with other drugs'),
  sideEffects: z.array(z.object({
    effect: z.string().describe('Name of the side effect'),
    frequency: z.string().describe('Frequency of the side effect (e.g., common, rare, 1 in 1000)'),
    severity: z.string().optional().describe('Severity of the side effect, if available')
  })).describe('List of side effects'),
  relativeSafetyScore: z.number().min(0).max(10).describe(`
    Relative safety scale from 0 (extremely unsafe) to 10 (extremely safe).
    Reference points:
    - 0: Extremely unsafe (e.g., pure cyanide)
    - 2: Very unsafe (e.g., cigarettes)
    - 4: Moderately unsafe (e.g., excessive alcohol consumption)
    - 6: Moderately safe (e.g., appropriate use of over-the-counter medications like aspirin)
    - 8: Very safe (e.g., moderate consumption of water)
    - 10: Extremely safe (e.g., breathing normal air)
    Place the drug on this scale based on its overall safety profile compared to these reference points.
  `),
  effectivenessComparison: z.array(z.object({
    intervention: z.string().describe('Name of the compared intervention'),
    relativeEffectiveness: z.string().describe('Relative effectiveness compared to the main drug'),
    dalysAvoided: z.union([z.number(), z.string()]).optional().describe('Estimated Disability-Adjusted Life Years (DALYs) avoided per patient'),
    qalysIncreased: z.union([z.number(), z.string()]).optional().describe('Estimated Quality-Adjusted Life Years (QALYs) increased per patient'),
    numberNeededToHarm: z.union([z.number(), z.string()]).optional().describe('Number Needed to Harm (NNH) to cause a negative health outcome'),
    numberNeededToTreat: z.union([z.number(), z.string()]).optional().describe('Number Needed to Treat (NNT) to achieve a positive health outcome'),
  })).describe('Comparison of effectiveness with other treatments'),
  dalysAvoided: z.union([z.number(), z.string()]).optional().describe('Estimated Disability-Adjusted Life Years (DALYs) avoided per patient'),
  qalysIncreased: z.union([z.number(), z.string()]).optional().describe('Estimated Quality-Adjusted Life Years (QALYs) increased per patient'),
  numberNeededToHarm: z.union([z.number(), z.string()]).optional().describe('Number Needed to Harm (NNH) to cause a negative health outcome'),
  numberOfPatients: z.union([z.number(), z.string()]).optional().describe('Number of patients globally who would benefit from the drug'),
  numberNeededToTreat: z.union([z.number(), z.string()]).optional().describe('Number Needed to Treat (NNT) to achieve a positive health outcome'),
  //referenceSources: z.array(articleSchema).describe('Sources of information used in compiling this report')
});

export type MetaAnalysisReportType = z.infer<typeof MetaAnalysisReportSchema>;


async function getWebResults(drugName: string, conditionName: string, numResults: number = 10): Promise<Article[]> {
  const query = generateMetaAnalysisQuery(drugName, conditionName);
  const searchResponse = await exa.searchAndContents(query, {
    numResults,
    useAutoprompt: false,
  });
  
  return searchResponse.results.map(result => ({
    score: result.score ?? 0,
    title: result.title ?? '',
    id: result.id ?? '',
    url: result.url ?? '',
    publishedDate: result.publishedDate ?? new Date().toISOString(),
    author: result.author ?? 'Unknown',
    text: result.text ?? '',
  }));
}

export interface ExtendedMetaAnalysisReport extends MetaAnalysisReportType {
  referenceSources: Article[];
}

export async function doMetaAnalysis(drugName: string, conditionName: string): Promise<ExtendedMetaAnalysisReport> {
  const webResults = await getWebResults(drugName, conditionName);
  const webResultsText = webResults.map(r => `## ${r.title}\n\n${r.text}`).join('\n\n');

  // const cleanedWebResults = await getLLMResponse({
  //   system: "You are a research assistant that strips out references and other irrelevant information from text returning only the information useful for a meta-analysis report.",
  //   user: `Strip out references and other irrelevant information from the following text and return all useful information about ${drugName}.  Here's the text to clean up: ${webResultsText}`,
  //   temperature: 0.7,
  //   model: "gpt-4o-mini",
  // })

  const prompt = `Based on the following information, create a detailed meta-analysis report for ${drugName} when used for treating ${conditionName}. 
  Include all required fields as specified in the schema, ensuring accuracy and comprehensive coverage of safety and effectiveness aspects.
  
  Web search results:
  ${webResultsText}`;

  //const model = getModel("gemini-1.5-flash")
  const model = getModel()

  const result = await generateObject({
    model,
    schema: MetaAnalysisReportSchema,
    prompt,
  });

  const report = result.object;
  const withReferences = report as ExtendedMetaAnalysisReport;
  withReferences.referenceSources = webResults;
 // report.referenceSources = webResults;
  return withReferences;
}