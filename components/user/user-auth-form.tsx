"use client"

import { signIn } from "next-auth/react"
import * as React from "react"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string
  onEmailSent?: () => void
}

export function UserAuthForm({
  className,
  callbackUrl,
  onEmailSent,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false)
  const [isEmailLoading, setIsEmailLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")

  const [finalCallbackUrl, setFinalCallbackUrl] = React.useState<
    string | undefined
  >(callbackUrl)

  // Check for callbackUrl in the URL and set default if not found
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlCallbackUrl = urlParams.get("callbackUrl")
    if (urlCallbackUrl) {
      setFinalCallbackUrl(urlCallbackUrl)
    } else if (!finalCallbackUrl) {
      setFinalCallbackUrl(window.location.href)
    }

    // Check if the current URL is wishonia.love or localhost
    const currentHost = window.location.hostname
    setShowSocialLogins(
      currentHost === "wishonia.love" || currentHost === "localhost"
    )
  }, [finalCallbackUrl])

  const [emailSent, setEmailSent] = React.useState<boolean>(false)
  const [showSocialLogins, setShowSocialLogins] = React.useState<boolean>(false)

  const handleEmailSignIn = async () => {
    setIsEmailLoading(true)
    setIsLoading(true)
    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: finalCallbackUrl,
      })
      if (result?.error) {
        console.error("Email sign-in error:", result.error)
        // Handle error (e.g., show error message to user)
      } else {
        setEmailSent(true)
        onEmailSent?.() // Call the onEmailSent callback if provided
      }
    } catch (error) {
      console.error("Email sign-in error:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsEmailLoading(false)
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn("mx-auto grid w-full max-w-sm gap-2", className)}
      {...props}
    >
      {emailSent ? (
        <div className="text-center">
          <div className="mb-2 text-lg font-semibold">Email Sent!</div>
          <div className="text-sm text-gray-600">
            Check your email for a login link. You can close this window.
          </div>
        </div>
      ) : (
        <>
          {showSocialLogins && (
            <>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                onClick={() => {
                  setIsGoogleLoading(true)
                  setIsLoading(true)
                  signIn("google", {
                    redirect: false,
                    callbackUrl: finalCallbackUrl,
                  })
                }}
                disabled={isGoogleLoading || isLoading}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Verify with Google
              </button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                onClick={() => {
                  setIsGithubLoading(true)
                  setIsLoading(true)
                  signIn("github", {
                    redirect: false,
                    callbackUrl: finalCallbackUrl,
                  })
                }}
                disabled={isGithubLoading || isLoading}
              >
                {isGithubLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.github className="mr-2 h-4 w-4" />
                )}{" "}
                Verify with Github
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>
            </>
          )}

          <div id="email-login" className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailLoading || isLoading}
              />
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "whitespace-nowrap"
                )}
                onClick={handleEmailSignIn}
                disabled={isEmailLoading || isLoading || !email}
              >
                {isEmailLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign in with Email"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
