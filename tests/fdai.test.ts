/**
 * @jest-environment node
 */
import { getOrCreateTestUser } from "@/tests/test-helpers"

import { getOrCreateDfdaAccessToken } from "@/lib/dfda"
import {
  doMetaAnalysis,
  foodOrDrugCostBenefitAnalysis,
  safeUnapprovedDrugs,
} from "@/lib/fdaiAgent"

describe("FDAi Tests", () => {
  it("generates meta-analysis", async () => {
    const result = await doMetaAnalysis("MDMA-Assisted Psychotherapy", "PTSD");
    console.log(result)
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
