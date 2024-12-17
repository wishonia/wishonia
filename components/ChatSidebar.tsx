import Link from "next/link"
import { Plus } from "@phosphor-icons/react/dist/ssr"

import { getCurrentUser } from "@/lib/session"

import ClearAllChats from "./ClearAllChats"
import { ChatSidebarList } from "./ChatSidebarList"
import ThemeToggle from "./ThemeToggle"
import UserBadge from "./UserBadge"

export async function ChatSidebar() {
  const loggedInUser = await getCurrentUser()
  if (!loggedInUser) {
    console.log("No user logged in from ChatSidebar component.")
    return null
  }

  return (
    <div className="flex h-screen flex-col gap-4 border-r p-3">
      <div className="px-2 text-sm font-light tracking-wide">Chat History</div>
      <Link
        href="/chat"
        // prefetch={true}
        className="flex items-center gap-2 rounded-md border px-2 py-1 hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-500/20"
      >
        <Plus /> <span>New Chat</span>
      </Link>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatSidebarList userId={loggedInUser ? loggedInUser.id : ""} />
      </div>

      <div className="flex flex-col gap-2">
        <ClearAllChats userId={loggedInUser.id} />
        <ThemeToggle />
        <UserBadge />
      </div>
    </div>
  )
}
