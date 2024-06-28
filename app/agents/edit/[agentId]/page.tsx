import React from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getAgent } from "@/lib/api/agents"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import EditAgent from "@/components/agents/edit-agent"
import { Shell } from "@/components/layout/shell"

export const metadata: Metadata = {
  title: "Edit Agent",
}

interface AgentEditProps {
  params: { agentId: string }
}

export default async function EditAgentPage({ params }: AgentEditProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const agent = await getAgent(params.agentId)

  if (!agent) {
    notFound()
  }
  return (
    <Shell className="size-full block md:grid">
      <EditAgent agentData={agent}></EditAgent>
    </Shell>
  )
}
