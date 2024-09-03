"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  callbackUrl?: string
}

export function UserAuthForm({
  className,
  callbackUrl,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false)
  const [isEmailLoading, setIsEmailLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")
  if (!callbackUrl) {
    callbackUrl = "/dashboard"
  }

    // Check for callbackUrl in the URL
    React.useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const urlCallbackUrl = urlParams.get('callbackUrl')
      if (urlCallbackUrl) {
        callbackUrl = urlCallbackUrl
      }
    }, [])

  const handleEmailSignIn = async () => {
    setIsEmailLoading(true)
    setIsLoading(true)
    await signIn("email", { email, redirect: false, callbackUrl })
    setIsEmailLoading(false)
    setIsLoading(false)
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true)
          setIsLoading(true)
          signIn("google", { redirect: false, callbackUrl })
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
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGithubLoading(true)
          setIsLoading(true)
          signIn("github", { redirect: false, callbackUrl })
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

      {/* OR Divider */}
      <div className="my-4 flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Email login section */}
      <div id="email-login" className="flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input-class flex-1 rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailLoading || isLoading}
          />
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "ml-2")}
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
    </div>
  )
}
