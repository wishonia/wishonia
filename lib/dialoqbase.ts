import { createClient } from "dialoqbase"

export async function getDialoqbaseClient() {
  const apiKey = process.env.DIALOQBASE_API_KEY
  if (!apiKey) {
    throw new Error("DIALOQBASE_API_KEY not found")
  }
  return createClient("https://dialoqbase.wishonia.love", apiKey)
}

export async function getWishoniaDocsAgent() {
  const dialoqbase = await getDialoqbaseClient()
  const response = await dialoqbase.bot.listAll()
  const bots = response.data
  if (!bots) {
    throw new Error("No bots found")
  }
  const agent = bots.find((bot) => bot.name === "Wishonia Docs Agent")
  if (!agent) {
    throw new Error("Wishonia Docs Agent not found")
  }
  return agent
}

export async function createDialoqbaseAgent(
  name: string,
  model: string,
  embedding: string
) {
  const dialoqbase = await getDialoqbaseClient()
  const { data, error } = await dialoqbase.bot.create({
    name,
    model,
    embedding,
  })
  if (error) {
    throw new Error(error.message)
  }
  return data
}
