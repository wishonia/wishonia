import React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getAgent } from "@/lib/api/agents"
import {  requireAuth } from "@/lib/auth"
import AgentForm from "@/components/agents/agent-form"
import { Shell } from "@/components/layout/shell"

export const metadata: Metadata = {
  title: "Edit Agent",
}

interface AgentEditProps {
  params: { agentId: string }
}

export default async function EditAgentPage({ params }: AgentEditProps) {
  await requireAuth(`/agents/${params.agentId}/edit`)

  const agent = await getAgent(params.agentId)

  if (!agent) {
    notFound()
  }
  return (
    <Shell className="block size-full md:grid">
      <AgentForm agentData={agent}></AgentForm>
    </Shell>
  )
}
