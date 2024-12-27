import Link from "next/link"

import HeadingText from "@/components/heading-text"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export default async function OpenSource() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/wishonia/wishonia",
    {
      next: { revalidate: 60 },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.error(e))

  const buttonText = `Fork Me On GitHub!`

  return (
    <section className="container py-12 lg:py-20">
      <div className="flex flex-col items-center gap-4">
        <HeadingText
          subtext="Fork it and make a better one!"
          className="text-center"
        >
          Want to improve the world?
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
