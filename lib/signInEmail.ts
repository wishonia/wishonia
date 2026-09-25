import type { Account, Profile } from "next-auth"

// The email address a sign-in proved the user controls: the address a magic
// link went to, or the address Google marks as verified. Other providers
// prove nothing about the email stored on the user.
export function getProvenSignInEmail(
  account: Account | null | undefined,
  profile?: Profile
): string | null {
  if (account?.provider === "email") {
    return account.providerAccountId?.toLowerCase() || null
  }
  if (account?.provider === "google") {
    const google = profile as (Profile & { email_verified?: boolean }) | undefined
    return google?.email_verified && google.email ? google.email.toLowerCase() : null
  }
  return null
}
