/**
 * @jest-environment node
 */
import { ChatOllama } from "@langchain/community/chat_models/ollama"

describe("Ollama", () => {
  jest.setTimeout(6000000)
  it("Ollama can be invoked and respond", async () => {
    const ollama = new ChatOllama({
      model: "llama3",
      baseUrl: "http://localhost:11434",
    })
    const result = await ollama.invoke(
      "What is a good name for a company that makes colorful socks?"
    )
    console.log({ result })
  })
})
