import { textCompletion } from "@/lib/llm";
import {researcher} from "@/lib/chat/researcher";

export async function foodOrDrugCostBenefitAnalysis(foodOrDrug: string) {
  const prompt = `Conduct a comprehensive cost-benefit analysis on the 
    regular consumption of "${foodOrDrug}", including both positive and negative effects. In your analysis, consider the following:

Health Benefits:

Summarize the major health benefits associated with the consumption of "${foodOrDrug}", based on existing research.
Discuss the potential mechanisms by which "${foodOrDrug}" provides these health benefits.
Health Risks:

Identify and summarize the potential health risks and side effects linked to the regular consumption of "${foodOrDrug}".
Discuss the severity and likelihood of these risks, referencing relevant studies.
Cost Analysis:

Estimate the economic cost of regularly consuming "${foodOrDrug}", considering factors like price, accessibility, and potential healthcare costs due to side effects.
Quality of Life:

Analyze how the regular consumption of "${foodOrDrug}" might impact an individual's quality of life, both positively and negatively.
DALYs (Disability-Adjusted Life Years):

Provide an estimated range of potential change in DALYs for the average person who regularly consumes "${foodOrDrug}".
Discuss the level of uncertainty in these estimates and the factors contributing to this uncertainty.
Overall Assessment:

Conclude with an overall assessment of whether the benefits of consuming "${foodOrDrug}" outweigh the risks and costs.
Include recommendations for specific populations (e.g., age groups, people with certain health conditions) who might benefit most or least from regular consumption of "${foodOrDrug}".
Please base your analysis on your available knowledge of existing research, and clearly state the degree of your uncertainty in each aspect of the analysis.`
  return await textCompletion(prompt, "text")
}

export async function safeUnapprovedDrugs() {
  const prompt = `Provide a comprehensive json array of
     the names of all treatments 
    that have been proven to be safe in the majority of studies but are unavailable
    due to patent expiration or lack of financial incentive due to regulatory burden. 
    
    Only include drugs that are not available to patients.
    List as many as you can.
    
    `
  return await textCompletion(prompt, "json_object")
}

export async function doMetaAnalysis(drugName: string, conditionName: string) {
  const prompt = `Meta-analysis on the safety and effectiveness of 
  "${drugName}"
   in treating the condition
    "${conditionName}". `

  return await researcher(prompt)
  // const message: ChatCompletionMessageParam = {
  //   role: 'user',
  //   content: prompt
  // }
  // const response = await perplexity.chat.completions.create({
  //   model: 'llama-3.1-sonar-huge-128k-online',
  //   stream: false,
  //   messages: [message],
  // });
  // return response.choices[0].message.content
}