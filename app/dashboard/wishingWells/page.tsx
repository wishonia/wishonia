import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getUserWishingWells } from "@/lib/api/wishingWells"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { WishingWellAddButton } from "@/components/wishingWell/wishing-well-add-button"
import { WishingWellList } from "@/components/wishingWell/wishing-well-list"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

export const metadata: Metadata = {
  title: "Your Wishing Wells",
  description: "Manage the Wishing Wells you make.",
}

export default async function WishingWellsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const wishingWells = await getUserWishingWells(user.id)

  return (
    <Shell>
      <DashboardHeader heading="Wishes" text="Manage your wishes.">
        <WishingWellAddButton />
      </DashboardHeader>
      <div className="divide-y divide-border rounded-md border">
        <WishingWellList wishingWells={wishingWells} />
      </div>
    </Shell>
  )
}
