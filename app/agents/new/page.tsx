import React from "react"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import AgentForm from "@/components/agents/agent-form"
import { Shell } from "@/components/layout/shell"

export default async function NewAgentPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  return (
    <Shell className="block size-full md:grid">
      <AgentForm></AgentForm>
    </Shell>
  )
}
