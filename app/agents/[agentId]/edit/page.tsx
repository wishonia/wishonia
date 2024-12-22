import React from "react"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getAgent } from "@/lib/api/agents"
import {  authOptions } from "@/lib/auth"
import AgentForm from "@/components/agents/agent-form"
import { Shell } from "@/components/layout/shell"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
  title: "Edit Agent",
}

interface AgentEditProps {
  params: { agentId: string }
}

export default async function EditAgentPage({ params }: AgentEditProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/signin")
  }

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
