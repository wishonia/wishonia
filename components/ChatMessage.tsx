"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { UIState } from "@/lib/chat/actions"
import { useUser } from "@/lib/useUser"

export interface ChatList {
  messages: UIState
  id: string
}

export function ChatMessage({ messages, id }: ChatList) {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      if (!pathname.includes(id) && messages.length === 1) {
        if (!pathname.includes("agents")) {
          window.history.replaceState({}, "", `/chat/${id}`)
        }
      }
    }
  }, [pathname, isSignedIn, messages])

  if (!messages.length) {
    return null
  }
  return (
    <div className="flex size-full flex-col items-start gap-5 whitespace-pre-wrap pt-10">
      {messages.map((message, index) => (
        <div key={message.id || index} className="w-full">
          {message.display}
        </div>
      ))}
    </div>
  )
}
