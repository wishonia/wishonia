"use client"

import Image from "next/image"
import { ArrowDown } from "lucide-react"

const manualLinks = {
  readFree: "https://manual.warondisease.org",
  amazon: "https://www.amazon.com/dp/B0GPLXFMMT",
  kindle: "https://www.amazon.com/dp/B0GPBH77XN",
  allRetailers: "https://books2read.com/u/baegEq",
  spotify: "https://open.spotify.com/show/1aX8mw9MmFzyiSBq2RNnu2",
}

export default function ManualHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-start justify-start bg-black px-4 py-8 text-white sm:items-center sm:justify-center sm:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 sm:gap-8 md:flex-row md:gap-12">
        {/* Manual cover */}
        <div className="flex-shrink-0">
          <Image
            src="/assets/manual-cover.jpg"
            alt="How to End War and Disease — A Practical Guide by Wishonia"
            width={320}
            height={480}
            className="w-36 rounded shadow-[0_0_40px_rgba(255,200,0,0.15)] sm:w-56 md:w-80"
            priority
          />
        </div>

        {/* Text content */}
        <div className="w-full text-center md:text-left">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-yellow-400 sm:text-sm">
            A transmission from
          </p>
          <h1 className="mb-1 font-mono text-2xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            WISHONIA
          </h1>
          <p className="mb-2 font-mono text-[10px] leading-snug text-gray-400 sm:mb-4 sm:text-sm">
            World Integrated System for High-Efficiency Optimization,
            Networked Intelligence, and Allocation
          </p>
          <blockquote className="mx-auto mb-3 max-w-lg border-l-2 border-yellow-400/50 pl-3 text-xs italic text-gray-300 sm:mb-6 sm:pl-4 sm:text-base md:mx-0">
            &ldquo;Hello, human! I&rsquo;ve been optimizing resource allocation
            on another planet for 4,297 years. I wrote you a manual. You&rsquo;re
            welcome.&rdquo;
          </blockquote>
          <h2 className="mb-2 text-lg font-bold leading-snug sm:mb-4 sm:text-2xl md:text-3xl">
            How to End War and Disease
          </h2>
          <p className="mx-auto mb-4 max-w-lg text-sm text-gray-300 sm:mb-8 sm:text-lg md:mx-0">
            Get 443 years of clinical research done in 36, avoid the
            apocalypse, and make humanity filthy rich through the magic of
            legal bribery.
          </p>

          {/* CTA buttons */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3 md:gap-4">
            <a
              href={manualLinks.readFree}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded border-2 border-yellow-400 bg-yellow-400 px-5 py-2.5 text-center text-sm font-bold text-black transition-colors hover:bg-yellow-300 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              Read Free Online
            </a>
            <a
              href={manualLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded border-2 border-white px-5 py-2.5 text-center text-sm font-bold transition-colors hover:bg-white hover:text-black sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              Get the Manual
            </a>
            <a
              href={manualLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded border-2 border-green-400 px-5 py-2.5 text-center text-sm font-bold text-green-400 transition-colors hover:bg-green-400 hover:text-black sm:w-auto sm:px-6 sm:py-3 sm:text-base"
            >
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() =>
          document
            .getElementById("landing-content")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="mt-6 animate-pulse rounded-full border-2 border-white p-2 transition-colors hover:bg-white hover:text-black sm:mt-12 sm:p-3"
        aria-label="Scroll down"
      >
        <ArrowDown size={20} className="sm:h-8 sm:w-8" />
      </button>
    </section>
  )
}
