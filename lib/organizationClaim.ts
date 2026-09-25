// Rules for claiming an organization that has no owner. A signed-in user can
// claim it when their email address is at the organization's website domain
// and the current sign-in proved they control that address. Admins can claim
// any organization.

// Hosts where the path, not the domain, names the organization, so an email
// address at the host shows no tie to the organization.
const SHARED_HOSTS = new Set([
  "facebook.com",
  "github.com",
  "gitlab.com",
  "instagram.com",
  "linkedin.com",
  "linktr.ee",
  "medium.com",
  "substack.com",
  "twitter.com",
  "x.com",
  "youtube.com",
])

export function organizationDomain(url: string | null): string | null {
  if (!url) return null
  try {
    const { hostname } = new URL(url.includes("://") ? url : `https://${url}`)
    const domain = hostname.toLowerCase().replace(/^www\./, "")
    if (!domain.includes(".") || SHARED_HOSTS.has(domain)) return null
    return domain
  } catch {
    return null
  }
}

export type ClaimCheck = { allowed: true } | { allowed: false; reason: string }

export function checkOrganizationClaim(input: {
  ownerId: string | null
  organizationUrl: string | null
  isAdmin: boolean
  email: string | null
  // The address the current sign-in proved (see lib/signInEmail.ts).
  verifiedEmail: string | null
}): ClaimCheck {
  if (input.ownerId) {
    return { allowed: false, reason: "This organization already has an owner." }
  }
  if (input.isAdmin) return { allowed: true }

  const domain = organizationDomain(input.organizationUrl)
  if (!domain) {
    return { allowed: false, reason: "Only an admin can claim this organization." }
  }
  const email = input.email?.toLowerCase() ?? ""
  const emailDomain = email.slice(email.lastIndexOf("@") + 1)
  if (!email.includes("@") || (emailDomain !== domain && !emailDomain.endsWith(`.${domain}`))) {
    return {
      allowed: false,
      reason: `To claim it, sign in with an email address at ${domain}.`,
    }
  }
  // A verification timestamp on the user is not enough: older accounts
  // could change their email after it was set.
  if (input.verifiedEmail?.toLowerCase() !== email) {
    return {
      allowed: false,
      reason: `To claim it, sign in with a magic link sent to ${input.email}.`,
    }
  }
  return { allowed: true }
}
