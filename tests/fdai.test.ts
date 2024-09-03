/**
 * @jest-environment node
 */
import { getOrCreateTestUser } from "@/tests/test-helpers";
import {writeFileSync} from "fs";
import { foodOrDrugCostBenefitAnalysis, safeUnapprovedDrugs } from "@/lib/agents/fdai/fdaiAgent";
import { doMetaAnalysis } from "@/lib/agents/fdai/fdaiMetaAnalyzer";
import { getOrCreateDfdaAccessToken } from "@/lib/dfda";
import {generateSideEffects} from "@/lib/agents/fdai/sideEffectsAgent";
import {generateSafetySummary} from "@/lib/agents/fdai/safetySummaryAgent";
import {
  generateMostEffectiveTreatments, generateMostEffectiveUnapprovedTreatments,
  generateTreatmentsByAlphabet,
  generateTreatmentsStartingWith
} from "@/lib/agents/fdai/treatmentsIndexer";
import {aiModels} from "@/lib/models/aiModelRegistry";


describe("FDAi Tests", () => {
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
