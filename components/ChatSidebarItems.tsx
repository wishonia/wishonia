"use client"

import { Chat } from "@/lib/types"
import { removeChat } from "@/app/actions"

import ChatSideBarActions from "./ChatSideBarActions"
import ChatSidebarItem from "./ChatSidebarItem"

interface SidebarItemsProps {
  chats?: Chat[]
}
function ChatSidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  return (
    <div className="flex w-full flex-col gap-1 ">
      {chats
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map(
          (chat, index) =>
            chat && (
              <div key={chat.id} className="w-full">
                <ChatSidebarItem index={index} chat={chat}>
                  <ChatSideBarActions
                    chat={chat}
                    removeChat={removeChat}
                    // shareChat={shareChat}
                  />
                </ChatSidebarItem>
              </div>
            )
        )
        .reverse()}
    </div>
  )
}

export default ChatSidebarItems
