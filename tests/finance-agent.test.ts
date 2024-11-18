/**
 * @jest-environment node
 */
import { estimateETFGain, analyzeMultipleIndustries } from "@/lib/finance/finance-agent"
import { ModelName } from "@/lib/utils/modelUtils"

describe("Finance Agent tests", () => {
  jest.setTimeout(60000) // 1-minute timeout

  it("estimates ETF gain for Biotechnology industry with different models", async () => {
    const industryName = "Biotechnology"
    const models: ModelName[] = [
      'gemini-1.5-pro',
      'claude-3-5-sonnet-20240620'
    ]

    for (const modelName of models) {
      console.log(`\nTesting with model: ${modelName}`)
      const result = await estimateETFGain(industryName, modelName)

      // Check the structure of the response
      expect(result).toHaveProperty("industryName")
      expect(result).toHaveProperty("parameters")
      expect(result).toHaveProperty("results")
      expect(result).toHaveProperty("tokenUsage")

      // Check parameters
      expect(result.parameters).toHaveProperty("regulatoryCost")
      expect(result.parameters).toHaveProperty("percentageOfRevenue")
      expect(result.parameters).toHaveProperty("potentialDecrease")
      expect(result.parameters).toHaveProperty("netProfitMargin")

      // Validate parameter ranges
      expect(result.parameters.regulatoryCost).toBeGreaterThan(0)
      expect(result.parameters.percentageOfRevenue).toBeGreaterThan(0)
      expect(result.parameters.percentageOfRevenue).toBeLessThan(100)
      expect(result.parameters.potentialDecrease).toBeGreaterThan(0)
      expect(result.parameters.potentialDecrease).toBeLessThan(100)
      expect(result.parameters.netProfitMargin).toBeGreaterThan(0)
      expect(result.parameters.netProfitMargin).toBeLessThan(100)

      // Check results
      expect(result.results).toHaveProperty("industryRevenue")
      expect(result.results).toHaveProperty("currentNetIncome")
      expect(result.results).toHaveProperty("deltaC")
      expect(result.results).toHaveProperty("percentIncreaseNetIncome")
      expect(result.results).toHaveProperty("estimatedETFIncrease")

      // Validate calculations
      expect(result.results.industryRevenue).toBeGreaterThan(0)
      expect(result.results.currentNetIncome).toBeGreaterThan(0)
      expect(result.results.deltaC).toBeGreaterThan(0)
      expect(result.results.percentIncreaseNetIncome).toBeGreaterThan(0)
      expect(result.results.estimatedETFIncrease).toBeGreaterThan(0)

      // Optional: Log the result for manual inspection
      console.log(`${modelName} Analysis:`, JSON.stringify(result, null, 2))
    }
  })

  it("estimates ETF gain for Financial Services industry", async () => {
    const industryName = "Financial Services"
    const result = await estimateETFGain(industryName)

    // Basic structure checks
    expect(result).toBeDefined()
    expect(result.industryName).toBe(industryName)
    
    // Check token usage
    expect(result.tokenUsage).toBeDefined()
    expect(result.tokenUsage?.totalTokens).toBeGreaterThan(0)

    // Validate that calculations are consistent
    const { parameters, results } = result
    
    // Calculate industry revenue manually to verify
    const calculatedRevenue = parameters.regulatoryCost / (parameters.percentageOfRevenue / 100)
    expect(results.industryRevenue).toBeCloseTo(calculatedRevenue, 5)

    // Calculate net income manually to verify
    const calculatedNetIncome = results.industryRevenue * (parameters.netProfitMargin / 100)
    expect(results.currentNetIncome).toBeCloseTo(calculatedNetIncome, 5)

    // Calculate regulatory cost savings manually to verify
    const calculatedSavings = parameters.regulatoryCost * (parameters.potentialDecrease / 100)
    expect(results.deltaC).toBeCloseTo(calculatedSavings, 5)

    console.log("Financial Services Analysis:", JSON.stringify(result, null, 2))
  })

  it("provides consistent results for the same industry", async () => {
    const industryName = "Healthcare"
    
    // Make two separate calls
    const result1 = await estimateETFGain(industryName)
    const result2 = await estimateETFGain(industryName)

    // Results should be similar but not identical due to AI variation
    // We'll check if they're within reasonable ranges of each other
    const marginOfError = 0.5 // 50% margin to account for AI variation
    
    expect(
      Math.abs(result1.parameters.regulatoryCost - result2.parameters.regulatoryCost) / 
      result1.parameters.regulatoryCost
    ).toBeLessThan(marginOfError)

    expect(
      Math.abs(result1.parameters.percentageOfRevenue - result2.parameters.percentageOfRevenue) / 
      result1.parameters.percentageOfRevenue
    ).toBeLessThan(marginOfError)

    console.log("Consistency Test Results:", {
      firstCall: result1,
      secondCall: result2
    })
  })

  it("analyzes multiple industries with different models", async () => {
    const industries = [
      "Biotechnology",
      "Financial Services",
      "Healthcare"
    ];

    const models: ModelName[] = [
      'gemini-1.5-pro',
      'claude-3-5-sonnet-20240620'
    ]

    for (const modelName of models) {
      console.log(`\n=== Testing with model: ${modelName} ===`)
      
      const results = await analyzeMultipleIndustries(industries, modelName);

      // Check we got results for all industries
      expect(results.length).toBe(industries.length);

      // Check results are sorted by ETF increase
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].results.estimatedETFIncrease)
          .toBeGreaterThanOrEqual(results[i + 1].results.estimatedETFIncrease);
      }

      // Verify structure of each result
      results.forEach(result => {
        // Check basic structure
        expect(result).toHaveProperty("industryName");
        expect(result).toHaveProperty("parameters");
        expect(result).toHaveProperty("results");
        
        // Check parameters are within reasonable ranges
        expect(result.parameters.regulatoryCost).toBeGreaterThan(0);
        expect(result.parameters.percentageOfRevenue).toBeLessThan(100);
        expect(result.parameters.potentialDecrease).toBeLessThan(100);
        expect(result.parameters.netProfitMargin).toBeLessThan(100);

        // Verify calculations for each industry
        const calculatedRevenue = result.parameters.regulatoryCost / 
          (result.parameters.percentageOfRevenue / 100);
        expect(result.results.industryRevenue).toBeCloseTo(calculatedRevenue, 5);
      });

      // Check that industries are unique
      const uniqueIndustries = new Set(results.map(r => r.industryName));
      expect(uniqueIndustries.size).toBe(industries.length);

      console.log(`\n${modelName} Multi-Industry Analysis:`, 
        JSON.stringify(results, null, 2));
    }
  }, 480000); // 8-minute timeout for multiple models and industries

  it("compares results between different models", async () => {
    const industryName = "Healthcare";
    const models: ModelName[] = [
      'gemini-1.5-pro',
      'claude-3-5-sonnet-20240620'
    ];

    const results = await Promise.all(
      models.map(model => estimateETFGain(industryName, model))
    );

    // Compare results between models
    results.forEach((result, i) => {
      console.log(`\n${models[i]} results:`)
      console.log(`ETF Increase: ${result.results.estimatedETFIncrease.toFixed(2)}%`)
      console.log(`Regulatory Cost: $${result.parameters.regulatoryCost.toFixed(2)}B`)
      console.log(`Token Usage: ${result.tokenUsage?.totalTokens || 'N/A'}`)
    });

    // Check that results are within reasonable ranges of each other
    const marginOfError = 0.5; // 50% margin
    for (let i = 0; i < results.length - 1; i++) {
      const ratio = Math.abs(
        results[i].results.estimatedETFIncrease - 
        results[i + 1].results.estimatedETFIncrease
      ) / results[i].results.estimatedETFIncrease;
      
      expect(ratio).toBeLessThan(marginOfError);
    }
  }, 120000); // 2-minute timeout for model comparison
}) 