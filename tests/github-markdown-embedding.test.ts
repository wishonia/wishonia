/**
 * @jest-environment node
 */
import { getOrCreateTestUser } from "@/tests/test-helpers"
import { DatasourceType } from "@prisma/client"

import { createAgentDatasource, getOrCreateAgent } from "@/lib/agent"
import { processChatRequest } from "@/lib/chat"
import { getOrCreateDataSource } from "@/lib/datasource"
import { absPathFromPublic } from "@/lib/fileHelper"
import { generateMarkdownEmbeddings } from "@/lib/loaders/github-markdown"

describe("Markdown Embedding", () => {
  it("should create markdown embeddings of the docs", async () => {
    const user = await getOrCreateTestUser()
    //const agent = await getOrCreateAgent("Digital Twin Safe Project Manger", user.id);
    let name = "Wishocracy Docs"
    const type = DatasourceType.MARKDOWN
    let url = "https://github.com/wishonia/wishonia/blob/main/"
    let userId = user.id
    let dataSource = await getOrCreateDataSource(name, type, url, userId)
    const relativePath = "docs/wishocracy"
    const agent = await getOrCreateAgent({
      name: "Digital Twin Safe Project Manger",
      userId: user.id,
    })
    await createAgentDatasource(agent.id, dataSource.id)
    // simulate the process create URL datasource and mark QUEUED for processing
      // Run job to fetch QUEUED data sources
    // Query agent and it do vector search and include matched chunks in the query to the LLM model
    const results = await generateMarkdownEmbeddings(
      absPathFromPublic(relativePath),
      dataSource
    )
    expect(results.length).toBeGreaterThan(0)
    const response = await processChatRequest(
      "What's a digital twin safe",
      [],
      agent.id
    )
    expect(response).toBeDefined()
  })
})
