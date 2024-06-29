"use client"

import Link from "next/link"
import { Warning } from "@phosphor-icons/react"

function RateLimited() {
  return (
    <div className="w-full rounded-md border p-4">
      <h1 className="flex items-center text-3xl font-semibold text-orange-400">
        Too many actions... <Warning />
      </h1>
      <p className="font-light text-muted-foreground">
        Your IP address has been rate-limted by{" "}
        <span className="font-semibold">GitHub</span>. Please{" "}
        <Link
          href="/sign-in"
          className="rounded-md border border-orange-400 bg-zinc-800 p-2 text-sm font-semibold text-white hover:border-transparent hover:bg-zinc-600"
        >
          Sign-in
        </Link>{" "}
        to continue or come back later.
      </p>
    </div>
  )
}

export default RateLimited
