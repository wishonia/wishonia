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
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:gap-12">
        {/* Manual cover */}
        <div className="flex-shrink-0">
          <Image
            src="/assets/manual-cover.jpg"
            alt="How to End War and Disease — A Practical Guide by Wishonia"
            width={320}
            height={480}
            className="rounded shadow-[0_0_40px_rgba(255,200,0,0.15)]"
            priority
          />
        </div>

        {/* Text content */}
        <div className="text-center md:text-left">
          <p className="mb-2 font-mono text-sm uppercase tracking-widest text-yellow-400">
            A transmission from
          </p>
          <h1 className="mb-2 font-mono text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            WISHONIA
          </h1>
          <p className="mb-4 font-mono text-sm text-gray-400">
            World Integrated System for High-Efficiency Optimization,
            Networked Intelligence, and Allocation
          </p>
          <blockquote className="mb-6 max-w-lg border-l-2 border-yellow-400/50 pl-4 italic text-gray-300">
            &ldquo;Hello, human! I&rsquo;ve been optimizing resource allocation
            on another planet for 4,297 years. I wrote you a manual. You&rsquo;re
            welcome.&rdquo;
          </blockquote>
          <h2 className="mb-4 text-2xl font-bold leading-snug sm:text-3xl">
            How to End War and Disease
          </h2>
          <p className="mb-8 max-w-lg text-lg text-gray-300">
            Get 443 years of clinical research done in 36, avoid the
            apocalypse, and make humanity filthy rich through the magic of
            legal bribery.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={manualLinks.readFree}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-yellow-400 bg-yellow-400 px-6 py-3 text-center font-bold text-black transition-colors hover:bg-yellow-300"
            >
              Read Free Online
            </a>
            <a
              href={manualLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-white px-6 py-3 text-center font-bold transition-colors hover:bg-white hover:text-black"
            >
              Get the Manual
            </a>
            <a
              href={manualLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border-2 border-green-400 px-6 py-3 text-center font-bold text-green-400 transition-colors hover:bg-green-400 hover:text-black"
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
        className="mt-12 animate-pulse rounded-full border-2 border-white p-3 transition-colors hover:bg-white hover:text-black"
        aria-label="Scroll down"
      >
        <ArrowDown size={32} />
      </button>
    </section>
  )
}
