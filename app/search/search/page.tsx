import { generateId } from 'ai'
import { redirect } from 'next/navigation'

import { AI } from '@/app/search/actions'
import { Chat } from '@/app/search/components/chat'

export const maxDuration = 60

export default function Page({
  searchParams
}: {
  searchParams: { q: string }
}) {
  if (!searchParams.q) {
    redirect('/')
  }
  const id = generateId()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} query={searchParams.q} />
    </AI>
  )
}
