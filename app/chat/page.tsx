import { AI } from "@/lib/chat/actions"
import { nanoid } from "@/lib/utils"
import Chat from "@/components/Chat"

import { getMissingKeys } from "../actions"

export default async function IndexPage() {
  const missingKeys = await getMissingKeys()
  const id = nanoid()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} missingKeys={missingKeys} />
    </AI>
  )
}
