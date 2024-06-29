import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function HeroHeader() {
  return (
    <>
      <section className="space-y-8 pb-12 pt-4 md:space-y-16 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <p className="font-english rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
            The Magical Kingdom of
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            Wishonia
          </h1>
          <p className="max-w-[42rem] text-sm font-semibold leading-normal sm:text-base sm:leading-8">
            Maximizing universal health and happiness through intelligent
            voluntary cooperation.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signin"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Become a Citizen
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Icons.github className="mr-2 h-4 w-4" />
              <span>Improve Wishonia</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
