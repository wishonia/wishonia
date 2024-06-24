import React from "react";
import AgentList from "@/components/agents/agent-list";
import {Shell} from "@/components/layout/shell";
export default function AgentListPage() {

  return (
      <Shell className="size-full">
        <AgentList></AgentList>
      </Shell>
  )
}
