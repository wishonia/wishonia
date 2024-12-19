import React from 'react'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import SearchChatHistoryContainer from './search-chat-history-container'

export const SearchChatHeader: React.FC = async () => {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <IconLogo className={cn('w-5 h-5')} />
          <span className="sr-only">Search Agent</span>
        </a>
      </div>
      <div className="flex gap-0.5">
        <ModeToggle />
        <SearchChatHistoryContainer location="header" />
      </div>
    </header>
  )
}

export default SearchChatHeader
