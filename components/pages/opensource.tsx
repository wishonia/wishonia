import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import HeadingText from "@/components/heading-text"
import { Icons } from "@/components/icons"

export default async function OpenSource() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/wishonia/wishonia",
    {
      next: { revalidate: 60 },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.error(e))

  const buttonText = `Star and Fork on Github`

  return (
    <section className="container py-12 lg:py-20">
      <div className="flex flex-col items-center gap-4">
        <HeadingText
          subtext="Pull requests and wish sumbmission via GitHub issues is appreciated!"
          className="text-center"
        >
          Wishonia is Free and Open Source!
        </HeadingText>
        <Link
          href={siteConfig.links.github}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Icons.star className="mr-2 h-4 w-4" />
          <span>{buttonText}</span>
        </Link>
      </div>
    </section>
  )
}
