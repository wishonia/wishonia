import { notFound } from 'next/navigation'

import { AI } from '@/app/search/actions'
import { Chat } from '@/app/search/components/chat'
import { getSharedSearchChat } from '@/lib/actions/searchChat'

export interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SharePageProps) {
  const chat = await getSharedSearchChat(params.id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const chat = await getSharedSearchChat(params.id)

  if (!chat || !chat.sharePath) {
    notFound()
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        isSharePage: true
      }}
    >
      <Chat id={params.id} />
    </AI>
  )
}
