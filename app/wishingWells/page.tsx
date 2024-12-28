import { Metadata } from "next"

import AfterLoginHandler from "@/components/AfterLoginHandler"
import { Shell } from "@/components/layout/shell"
import { PollRandomWishingWells } from "@/components/poll-random-wishing-wells"
import { getCurrentUser } from "@/lib/session"

export const metadata: Metadata = {
  title: "Wishing Wells",
  description: "Decide how much to allocate to each Wishing Well.",
}

interface WishingWellProps {
  searchParams: { thisWishingWellName: string; thatWishingWellName: string }
}

export default async function WishingWellsPage({
  searchParams,
}: WishingWellProps) {
  const user = await getCurrentUser()

  return (
    <Shell>
      <AfterLoginHandler />
      <PollRandomWishingWells user={user} />
    </Shell>
  )
}
