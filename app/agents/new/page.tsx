import React from "react";
import NewAgent from "@/components/agents/configure-agent";
import {Shell} from "@/components/layout/shell";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth";

export default async function NewAgentPage() {
  const user=await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }  
  return (
      <Shell className="size-full block md:grid">
        <NewAgent>
        </NewAgent>
      </Shell>
  )
}