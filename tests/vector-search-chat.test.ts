/**
 * @jest-environment node
 */
import { getOrCreateTestUser } from "@/tests/test-helpers"
import { DatasourceType } from "@prisma/client"

import { createAgentDatasource, getOrCreateAgent } from "@/lib/agent"
import { processChatRequest } from "@/lib/chat"
import { getOrCreateDataSource } from "@/lib/datasource"

describe("Retrieval Augmented Generation Chat with Sources", () => {
    it("should be able to respond with info from multiple data sources", async () => {
        const user = await getOrCreateTestUser()
        let name = "Wishocracy Docs"
        const type = DatasourceType.MARKDOWN
        let url = "https://github.com/wishonia/wishonia/blob/main/"
        let userId = user.id
        let dataSource = await getOrCreateDataSource(name, type, url, userId)
        const agent = await getOrCreateAgent({
            name: "Digital Twin Safe Project Manger",
            userId: user.id,
        })
        await createAgentDatasource(agent.id, dataSource.id)
        const response = await processChatRequest(
            "What's a digital twin safe",
            [],
            agent.id
        )
        expect(response).toBeDefined()
    })
})
