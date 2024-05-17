import { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import AfterLoginHandler from "@/components/AfterLoginHandler"
import {WishingWellsList} from "@/components/wishing-well-list";

export const metadata: Metadata = {
  title: "Your Wishing Wells",
  description: "How much everyone thinks we should allocate to solving each global problem",
}

interface DashboardProps {
  searchParams: { from: string; to: string }
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
        <AfterLoginHandler></AfterLoginHandler>
        <WishingWellsList></WishingWellsList>
    </Shell>
  )
}
