import React from "react";
import AgentList from "@/components/agents/agent-list";
import {Shell} from "@/components/layout/shell";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth";

export default async function AgentListPage() {
  const user=await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }
  return (
      <Shell className="size-full">
        <AgentList></AgentList>
      </Shell>
  )
}
