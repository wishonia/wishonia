"use client"

import { Chat } from "@/lib/types"
import { removeChat } from "@/app/actions"

import SideBarActions from "./SideBarActions"
import SidebarItem from "./SidebarItem"

interface SidebarItemsProps {
  chats?: Chat[]
}
function SidebarItems({ chats }: SidebarItemsProps) {
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
                <SidebarItem index={index} chat={chat}>
                  <SideBarActions
                    chat={chat}
                    removeChat={removeChat}
                    // shareChat={shareChat}
                  />
                </SidebarItem>
              </div>
            )
        )
        .reverse()}
    </div>
  )
}

export default SidebarItems
