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


describe("FDAi Tests", () => {
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
