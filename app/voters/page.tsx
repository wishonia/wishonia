import type { Metadata } from "next"

import { env } from "@/env.mjs"

import { VotersList } from "./VotersList"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Voter list",
  description: "All Voters",
}

export default function VotersPage() {
  return (
    <div className="container py-20">
      <VotersList />
    </div>
  )
}
