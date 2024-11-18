import { LanguageModelV1 } from "@ai-sdk/provider";
import { generateObject } from "ai";
import { z } from "zod";
import { getModel, ModelName } from "@/lib/utils/modelUtils";

// Define the schema for industry parameters
const IndustryParametersSchema = z.object({
  regulatoryCost: z.number().describe("Estimated Annual Cost of Regulation in USD billions"),
  percentageOfRevenue: z.number().describe("Percentage of Industry Revenue that regulatory cost represents"),
  potentialDecrease: z.number().describe("Estimated Potential Percentage Decrease in Regulatory Costs"),
  netProfitMargin: z.number().describe("Average Net Profit Margin for the industry in percentage"),
});

type IndustryParameters = z.infer<typeof IndustryParametersSchema>;

// Function to calculate ETF impact
function calculateETFImpact(params: IndustryParameters) {
  const { regulatoryCost, percentageOfRevenue, potentialDecrease, netProfitMargin } = params;

  // Convert percentages to decimals
  const P_reg = percentageOfRevenue / 100;
  const potentialDecreaseDecimal = potentialDecrease / 100;
  const netProfitMarginDecimal = netProfitMargin / 100;

  // Calculate Industry Revenue
  const industryRevenue = regulatoryCost / P_reg;

  // Calculate Current Net Income
  const currentNetIncome = industryRevenue * netProfitMarginDecimal;

  // Calculate Regulatory Cost Savings
  const deltaC = regulatoryCost * potentialDecreaseDecimal;

  // Calculate Percentage Increase in Net Income
  const percentIncreaseNetIncome = (deltaC / currentNetIncome) * 100;

  // Estimate Percentage Increase in ETF Value
  const estimatedETFIncrease = percentIncreaseNetIncome;

  return {
    industryRevenue,
    currentNetIncome,
    deltaC,
    percentIncreaseNetIncome,
    estimatedETFIncrease,
  };
}

export async function estimateETFGain(
  industryName: string,
  modelName?: ModelName
) {
  try {
    const model: LanguageModelV1 = getModel(modelName);

    const prompt = `As a financial analyst specializing in regulatory economics and industry analysis, please provide detailed estimates for the following parameters in the ${industryName} industry.

For each parameter, provide your estimate along with a brief explanation of your reasoning based on industry data, regulatory filings, and market research:

1. Estimated Annual Cost of Regulation in USD (in billions)
- Consider direct compliance costs, reporting requirements, and operational adjustments
- Include costs from major regulatory bodies (e.g., FDA, EPA, SEC, etc.)
- Factor in both federal and state-level regulatory burdens
- Base estimate on recent industry reports and regulatory impact assessments

2. Percentage of Industry Revenue that the regulatory cost represents
- Consider the industry's total annual revenue
- Account for both large and small companies in the sector
- Use recent financial statements and industry reports
- Factor in variations across different market segments

3. Estimated Potential Percentage Decrease in Regulatory Costs under maximal deregulation
- Consider which regulations are likely to be streamlined or eliminated
- Assess historical impacts of deregulation in similar sectors
- Account for essential regulations that would likely remain
- Consider technological improvements that could reduce compliance costs

4. Average Net Profit Margin for the industry
- Use recent industry financial data
- Consider both market leaders and smaller players
- Account for regional variations
- Factor in current market conditions and trends

Please provide numerical estimates that are:
- Based on current market data and industry reports
- Realistic and defensible
- Conservative rather than optimistic
- Supported by observable industry trends

Format your response as a JSON object with the following keys:
- regulatoryCost (number in billions)
- percentageOfRevenue (number)
- potentialDecrease (number)
- netProfitMargin (number)

Example format (but provide your own researched values):
{
  "regulatoryCost": 150,
  "percentageOfRevenue": 12.5,
  "potentialDecrease": 40,
  "netProfitMargin": 15
}`;

    const result = await generateObject({
      model,
      schema: IndustryParametersSchema,
      prompt,
      experimental_telemetry: { isEnabled: true },
    });

    const parameters = result.object as IndustryParameters;
    const results = calculateETFImpact(parameters);

    // Log results
    console.log(`\n--- Analysis for the ${industryName} Industry ---\n`);
    console.log(`Estimated Annual Cost of Regulation: $${parameters.regulatoryCost.toFixed(2)} billion`);
    console.log(`Percentage of Industry Revenue (Regulatory Costs): ${parameters.percentageOfRevenue}%`);
    console.log(`Potential Decrease in Regulatory Costs: ${parameters.potentialDecrease}%`);
    console.log(`Average Net Profit Margin: ${parameters.netProfitMargin}%\n`);

    console.log(`Calculated Industry Revenue: $${results.industryRevenue.toFixed(2)} billion`);
    console.log(`Current Net Income: $${results.currentNetIncome.toFixed(2)} billion`);
    console.log(`Regulatory Cost Savings: $${results.deltaC.toFixed(2)} billion`);
    console.log(`Percentage Increase in Net Income: ${results.percentIncreaseNetIncome.toFixed(2)}%`);
    console.log(`Estimated Percentage Increase in ETF Value: ${results.estimatedETFIncrease.toFixed(2)}%\n`);

    // Calculate annual growth rate
    const years = 5;
    const annualGrowthRate = results.estimatedETFIncrease / years;
    console.log(`Estimated Annual ETF Value Increase over ${years} years: ${annualGrowthRate.toFixed(2)}% per year`);

    return {
      industryName,
      parameters,
      results,
      tokenUsage: result.usage,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error estimating ETF gain:', error.message);
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

export type IndustryAnalysis = {
  industryName: string;
  parameters: IndustryParameters;
  results: {
    industryRevenue: number;
    currentNetIncome: number;
    deltaC: number;
    percentIncreaseNetIncome: number;
    estimatedETFIncrease: number;
  };
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};

export async function analyzeMultipleIndustries(
  industries: string[],
  modelName?: ModelName
): Promise<IndustryAnalysis[]> {
  try {
    console.log(`\n🔍 Analyzing ${industries.length} industries using ${modelName || 'default'} model...\n`);
    
    // Process industries sequentially to avoid rate limiting
    const results: IndustryAnalysis[] = [];
    
    for (const industry of industries) {
      console.log(`\n📊 Analyzing ${industry}...`);
      const result = await estimateETFGain(industry, modelName);
      results.push(result);
    }

    // Sort results by estimated ETF increase
    results.sort((a, b) => 
      b.results.estimatedETFIncrease - a.results.estimatedETFIncrease
    );

    // Print comparative table
    console.log('\n=== Comparative Industry Analysis ===\n');
    console.table(results.map(r => ({
      Industry: r.industryName,
      'Reg Cost ($B)': r.parameters.regulatoryCost.toFixed(1),
      '% of Revenue': r.parameters.percentageOfRevenue.toFixed(1),
      'Potential Decrease (%)': r.parameters.potentialDecrease.toFixed(1),
      'Net Margin (%)': r.parameters.netProfitMargin.toFixed(1),
      'ETF Increase (%)': r.results.estimatedETFIncrease.toFixed(1),
      'Annual Growth (%)': (r.results.estimatedETFIncrease / 5).toFixed(1),
    })));

    // Print summary statistics
    const avgETFIncrease = results.reduce((sum, r) => 
      sum + r.results.estimatedETFIncrease, 0) / results.length;
    
    const maxETFIncrease = Math.max(...results.map(r => 
      r.results.estimatedETFIncrease));
    
    const minETFIncrease = Math.min(...results.map(r => 
      r.results.estimatedETFIncrease));

    console.log('\n=== Summary Statistics ===');
    console.log(`Average ETF Increase: ${avgETFIncrease.toFixed(2)}%`);
    console.log(`Maximum ETF Increase: ${maxETFIncrease.toFixed(2)}%`);
    console.log(`Minimum ETF Increase: ${minETFIncrease.toFixed(2)}%`);

    // Calculate total token usage if available
    const totalTokens = results.reduce((sum, r) => 
      sum + (r.tokenUsage?.totalTokens || 0), 0);
    if (totalTokens > 0) {
      console.log(`\nTotal Tokens Used: ${totalTokens.toLocaleString()}`);
    }

    return results;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in industry analysis:', error.message);
      throw error;
    }
    throw new Error('An unknown error occurred during industry analysis');
  }
}
