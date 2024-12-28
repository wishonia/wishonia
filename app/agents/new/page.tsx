import { redirect } from "next/navigation"
import React from "react"

import AgentForm from "@/components/agents/agent-form"
import { Shell } from "@/components/layout/shell"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export default async function NewAgentPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  return (
    <Shell className="block size-full md:grid">
      <AgentForm />
    </Shell>
  )
}
