import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/config/site"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user/user-auth-form"

export const metadata: Metadata = {
  title: `Enter ${siteConfig.name}`,
  description: siteConfig.description ,
}

export default function Signin() {
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
{/*         <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to {siteConfig.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Please verify your identity to enter the magical kingdom!
          </p>
        </div> */}
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Not a member yet?
          </Link>
        </p>
      </div>
    </main>
  )
}
