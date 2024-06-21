import Link from 'next/link'
import { SidebarList } from './SidebarList'
import UserBadge from './UserBadge'
import ThemeToggle from './ThemeToggle'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import ClearAllChats from './ClearAllChats'
import {getCurrentUser} from "@/lib/session";

export async function ChatHistory() {
  const loggedInUser = await getCurrentUser()
  if (!loggedInUser) {
    console.log('No user logged in from ChatHistory component.')
    return null
  }

  return (
    <div className='gap-4 p-3  border-r flex flex-col h-full justify-between'>
      <div className='px-2 font-light text-sm tracking-wide'>Chat History</div>
      <Link
        href='/chat'
        // prefetch={true}
        className='flex items-center gap-2 py-1 px-2 border rounded-md hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-500/20'
      >
        <Plus /> <span>New Chat</span>
      </Link>

      <div className='size-full'>
        <SidebarList userId={loggedInUser ? loggedInUser.id : ''} />
      </div>

      <div className='flex flex-col gap-2'>
        <ClearAllChats userId={loggedInUser.id} />
        <ThemeToggle />
        <UserBadge />
      </div>
    </div>
  )
}
