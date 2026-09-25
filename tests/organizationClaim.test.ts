/**
 * @jest-environment node
 */
import { checkOrganizationClaim, organizationDomain } from "@/lib/organizationClaim"

const claimant = {
  ownerId: null,
  organizationUrl: "https://www.redcross.org/about",
  isAdmin: false,
  email: "jane@redcross.org",
  emailVerified: new Date(),
  providers: [] as string[],
}

describe("organizationDomain", () => {
  it.each([
    ["https://www.redcross.org/about", "redcross.org"],
    ["redcross.org", "redcross.org"],
    ["http://Donate.RedCross.org", "donate.redcross.org"],
  ])("reads %p as %p", (url, domain) => {
    expect(organizationDomain(url)).toBe(domain)
  })

  it.each([null, "", "not a url", "https://localhost", "https://github.com/some-org"])(
    "returns null for %p",
    (url) => {
      expect(organizationDomain(url)).toBeNull()
    }
  )
})

describe("checkOrganizationClaim", () => {
  it("allows a verified email at the organization's domain", () => {
    expect(checkOrganizationClaim(claimant)).toEqual({ allowed: true })
  })

  it("allows an email at a subdomain of the organization's domain", () => {
    expect(
      checkOrganizationClaim({ ...claimant, email: "jane@mail.redcross.org" })
    ).toEqual({ allowed: true })
  })

  it("rejects an email at another domain that ends with the same letters", () => {
    const check = checkOrganizationClaim({ ...claimant, email: "jane@notredcross.org" })
    expect(check).toEqual({
      allowed: false,
      reason: "To claim it, sign in with an email address at redcross.org.",
    })
  })

  it("rejects an unverified email unless Google verified it", () => {
    const unverified = { ...claimant, emailVerified: null }
    expect(checkOrganizationClaim(unverified).allowed).toBe(false)
    expect(
      checkOrganizationClaim({ ...unverified, providers: ["github"] }).allowed
    ).toBe(false)
    expect(
      checkOrganizationClaim({ ...unverified, providers: ["google"] }).allowed
    ).toBe(true)
  })

  it("rejects every claim once the organization has an owner", () => {
    expect(
      checkOrganizationClaim({ ...claimant, ownerId: "someone", isAdmin: true })
    ).toEqual({ allowed: false, reason: "This organization already has an owner." })
  })

  it("lets only admins claim an organization without a usable website", () => {
    const noWebsite = { ...claimant, organizationUrl: null }
    expect(checkOrganizationClaim(noWebsite).allowed).toBe(false)
    expect(checkOrganizationClaim({ ...noWebsite, isAdmin: true })).toEqual({
      allowed: true,
    })
  })
})
