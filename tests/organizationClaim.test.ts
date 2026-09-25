/**
 * @jest-environment node
 */
import type { Account, Profile } from "next-auth"

import { checkOrganizationClaim, organizationDomain } from "@/lib/organizationClaim"
import { getProvenSignInEmail } from "@/lib/signInEmail"

const claimant = {
  ownerId: null,
  organizationUrl: "https://www.redcross.org/about",
  isAdmin: false,
  email: "jane@redcross.org",
  verifiedEmail: "jane@redcross.org",
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
  it("allows an email at the organization's domain that the sign-in proved", () => {
    expect(checkOrganizationClaim(claimant)).toEqual({ allowed: true })
  })

  it("compares the proven address without regard to case", () => {
    expect(
      checkOrganizationClaim({ ...claimant, email: "Jane@RedCross.org" })
    ).toEqual({ allowed: true })
  })

  it("allows an email at a subdomain of the organization's domain", () => {
    const email = "jane@mail.redcross.org"
    expect(
      checkOrganizationClaim({ ...claimant, email, verifiedEmail: email })
    ).toEqual({ allowed: true })
  })

  it("rejects an email at another domain that ends with the same letters", () => {
    const email = "jane@notredcross.org"
    expect(checkOrganizationClaim({ ...claimant, email, verifiedEmail: email })).toEqual({
      allowed: false,
      reason: "To claim it, sign in with an email address at redcross.org.",
    })
  })

  it("rejects a sign-in that proved no address", () => {
    expect(checkOrganizationClaim({ ...claimant, verifiedEmail: null })).toEqual({
      allowed: false,
      reason: "To claim it, sign in with a magic link sent to jane@redcross.org.",
    })
  })

  it("rejects an email that differs from the address the sign-in proved", () => {
    // An account verified one address and later changed its email.
    expect(
      checkOrganizationClaim({ ...claimant, verifiedEmail: "jane@gmail.com" }).allowed
    ).toBe(false)
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

describe("getProvenSignInEmail", () => {
  const account = (provider: string, providerAccountId: string): Account => ({
    provider,
    providerAccountId,
    type: provider === "email" ? "email" : "oauth",
  })

  it("returns the address a magic link went to", () => {
    expect(getProvenSignInEmail(account("email", "Jane@RedCross.org"))).toBe(
      "jane@redcross.org"
    )
  })

  it("returns a Google email only when Google marks it verified", () => {
    const google = account("google", "12345")
    const profile = { email: "jane@redcross.org" } as Profile
    expect(
      getProvenSignInEmail(google, { ...profile, email_verified: true } as Profile)
    ).toBe("jane@redcross.org")
    expect(getProvenSignInEmail(google, profile)).toBeNull()
  })

  it("returns null for other providers and for requests that are not sign-ins", () => {
    expect(
      getProvenSignInEmail(account("github", "999"), { email: "jane@redcross.org" } as Profile)
    ).toBeNull()
    expect(getProvenSignInEmail(null)).toBeNull()
  })
})
