import React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { WishForm } from "@/components/wishingWell/wish-form"

export const metadata: Metadata = {
  title: "Make a Wish",
}

interface WishingWellEditProps {
  params: { wishingWellId?: string }
}

export default async function WishingWellEdit({
  params,
}: WishingWellEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <DashboardHeader heading="Make a Wish" text="Choose wisely!" />
      <div className="grid grid-cols-1 gap-10">
        <WishForm></WishForm>
      </div>
    </Shell>
  )
}
