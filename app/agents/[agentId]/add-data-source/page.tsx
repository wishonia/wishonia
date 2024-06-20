import NewAgent from "@/components/agents/configure-agent";
import {Shell} from "@/components/layout/shell";
import React from "react";
import AddAgentDataSource from "@/components/agents/add-agent-data-source";


export default function AddAgentDataSourcePage() {
    return (
        <Shell>
            <AddAgentDataSource></AddAgentDataSource>
        </Shell>
    )
}