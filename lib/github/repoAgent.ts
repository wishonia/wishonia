import {
  Document,
  MetadataMode,
  NodeWithScore,
  VectorStoreIndex,
} from "llamaindex"

import { absPathFromPublic } from "@/lib/fileHelper"
import { readAllMarkdownFiles } from "@/lib/markdownReader"

let queryEngine: any = null

async function initializeQueryEngine() {
  const markdownFiles = await readAllMarkdownFiles(absPathFromPublic(""))

  const documents = markdownFiles.map((file) => {
    return new Document({
      text: file.content,
      id_: file.absFilePath,
    })
  })

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents)

  // Query the index
  queryEngine = index.asQueryEngine()
}

async function queryRepo(question: string): Promise<string> {
  if (!queryEngine) {
    await initializeQueryEngine()
  }

  try {
    const { response, sourceNodes } = await queryEngine.query({
      query: question,
    })

    // Output response with sources
    console.log(response)

    if (sourceNodes) {
      sourceNodes.forEach((source: NodeWithScore, index: number) => {
        const relationships = source.node.relationships
        const filePath = relationships.SOURCE
        console.log(
          `\n${index}: Score: ${source.score} - ${source.node
            .getContent(MetadataMode.NONE)
            .substring(0, 50)}...\n
                        filePath: ${filePath}\n
                        `
        )
      })
    }

    return response
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

export default queryRepo
