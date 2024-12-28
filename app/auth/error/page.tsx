import Link from "next/link"

import { Shell } from "@/components/layout/shell"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; provider?: string }
}) {
  const error = searchParams?.error
  const provider = searchParams?.provider

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked:
      "To link this account, please sign in first with your existing account, then try connecting again from the settings page.",
    AccountAlreadyConnected: `This ${provider} account is already connected to another user. Please use a different ${provider} account or contact support if you believe this is an error.`,
    LinkingFailed:
      "There was an error linking your account. Please try again or contact support if the problem persists.",
    OAuthCallback:
      "There was an error connecting to the service. Please try again later.",
    OAuthSignin:
      "There was an error starting the OAuth flow. Please try again.",
    AccountAlreadyLinked: `This ${provider} account is already connected to another user.`,
    default: "An error occurred during authentication. Please try again.",
  }

  const errorMessage = errorMessages[error || ""] || errorMessages.default

  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="max-w-md text-center text-muted-foreground">
          {errorMessage}
        </p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/settings/connections">
              Back to Connections
            </Link>
          </Button>
        </div>
      </div>
    </Shell>
  )
}
