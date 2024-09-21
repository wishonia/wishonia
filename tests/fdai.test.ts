/**
 * @jest-environment node
 */
import { writeFileSync } from "fs";
import { getOrCreateTestUser } from "@/tests/test-helpers";
import {writeArticle} from "@/lib/agents/researcher/researcher";
import { foodOrDrugCostBenefitAnalysis, safeUnapprovedDrugs } from "@/lib/agents/fdai/fdaiAgent";
import { doMetaAnalysis } from "@/lib/agents/fdai/fdaiMetaAnalyzer";
import { generateSafetySummary } from "@/lib/agents/fdai/safetySummaryAgent";
import { generateSideEffects } from "@/lib/agents/fdai/sideEffectsAgent";
import { generateMostEffectiveTreatments,
  generateMostEffectiveUnapprovedTreatments,
  generateTreatmentsStartingWith } from "@/lib/agents/fdai/treatmentsIndexer";
import { getOrCreateDfdaAccessToken } from "@/lib/dfda";
import { aiModels } from "@/lib/models/aiModelRegistry";
import {dumpTypeDefinition} from "@/lib/utils/dumpTypeDefinition";

describe("FDAi Tests", () => {
  it("generates a report based on a study", async () => {
      const article = await writeArticle("The most effective experimental treatments for long covid",
          "test-user",
          {
        modelName: "claude-3-5-sonnet-20240620",
      })
      console.log(dumpTypeDefinition(article))
      expect(article).not.toBeNull()
  });
  it("generates treatments by alphabet", async () => {
    const geminiProUnapproved = await generateMostEffectiveUnapprovedTreatments("PTSD", aiModels['gemini-pro']);
    console.log("geminiProUnapproved", geminiProUnapproved)
    const cheapUnapproved = await generateMostEffectiveUnapprovedTreatments("PTSD", aiModels['cheap-model']);
    console.log("cheapUnapproved", cheapUnapproved)
    const smartUnapproved = await generateMostEffectiveUnapprovedTreatments("PTSD", aiModels['smart-model']);
    console.log("smartUnapproved", smartUnapproved)
    const cheapEffective = await generateMostEffectiveTreatments("PTSD", aiModels['cheap-model']);
    console.log("cheapEffective", cheapEffective)
    const smartEffective = await generateMostEffectiveTreatments("PTSD", aiModels['smart-model']);
    console.log("smartEffective", smartEffective)
    const cheap = await generateTreatmentsStartingWith("PTSD", "A", aiModels['cheap-model']);
    console.log("cheap", cheap)
    const smart = await generateTreatmentsStartingWith("PTSD", "A", aiModels['smart-model']);
    console.log("smart", smart)
  });
  it("generates safety-summary", async () => {
    const result = await generateSafetySummary("MDMA-Assisted Psychotherapy");
    expect(result).not.toBeNull()
    console.log(result)
  }, 60000)
  it("generates side-effects", async () => {
    const result = await generateSideEffects("MDMA-Assisted Psychotherapy");
    expect(result).not.toBeNull()
    expect(result.length).toBeGreaterThan(0)
    console.log(result)
  }, 60000)
  it("generates meta-analysis", async () => {
    const result = await doMetaAnalysis("MDMA-Assisted Psychotherapy", "PTSD");
    console.log(result)
    writeFileSync("meta-analysis.json", JSON.stringify(result, null, 2))
  })
  it("gets dfda access token", async () => {
    const testUser = await getOrCreateTestUser()
    const result = await getOrCreateDfdaAccessToken(testUser.id)
    console.log(result)
    expect(result).not.toBeNull()
    const result2 = await getOrCreateDfdaAccessToken(testUser.id)
    expect(result2).toEqual(result)
  })
  it("Do cost-benefit analysis on a supplement", async () => {
    const result = await foodOrDrugCostBenefitAnalysis("NMN")
    console.log(result)
  }, 45000)
  it("safe unapproved drugs", async () => {
    const safeUnapproved = await safeUnapprovedDrugs()
    console.log(safeUnapproved)
  }, 45000)
})
