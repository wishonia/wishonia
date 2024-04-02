import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ImageFrame } from "@/components/image-frame"

export default function HeroHeader(props) {
  return (
    <>
      <section className="space-y-8 pb-12 pt-4 md:space-y-16 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <p className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium font-semibold">
            Global Priorities Referendum on
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            War and Disease
          </h1>
          <p className="max-w-[42rem] text-sm leading-normal text-dark-foreground text-gray-900 font-semibold sm:text-base sm:leading-8">
            Humanity has a finite amount of brains and resources.
          </p>
          <p className="max-w-[42rem] text-sm leading-normal text-dark-foreground text-gray-900 font-semibold sm:text-base sm:leading-8">
            Adjust how much governments globally should allocate to war/military vs helping 2 billion people suffering from diseases.
          </p>
          <div className="flex gap-4">
            <Link
                href="/signin"
                className={cn(buttonVariants({variant: "default"}))}
            >
              Get Started
            </Link>
            <Link
                href={siteConfig.links.github}
                target="_blank"
                className={cn(buttonVariants({variant: "outline"}))}
            >
              <Icons.github className="mr-2 h-4 w-4"/>
              <span>GitHub</span>
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ImageFrame>
            <Image
                className="rounded-lg"
                src="/images/hero-img.jpg"
                width={1364}
              height={866}
              quality={100}
              alt="Header image"
            />
          </ImageFrame>
        </div>
      </section>
    </>
  )
}
