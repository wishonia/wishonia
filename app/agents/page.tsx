import { redirect } from "next/navigation"
import React from "react"

import AgentListPublished from "@/components/agents/agent-list-published";
import { Shell } from "@/components/layout/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export default async function AgentListPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  return (
    <Shell className="size-full">
      <AgentListPublished />
    </Shell>
  )
}
