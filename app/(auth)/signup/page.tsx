import { Metadata } from "next"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user/user-auth-form"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account",
}

export default function Signup() {
  return (
    <main className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.back className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Join {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a provider to verify your identity
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already a citizen?{" "}
          <Link
            href="/signin"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
