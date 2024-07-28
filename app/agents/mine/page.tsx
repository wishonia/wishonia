import React from "react"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import AgentListMine from "@/components/agents/agent-list-mine"
import { Shell } from "@/components/layout/shell"

export default async function AgentListPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  return (
    <Shell className="size-full">
      <AgentListMine></AgentListMine>
    </Shell>
  )
}
