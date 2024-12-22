import React from 'react'
import { SearchChatHistory } from './searchChatHistory'
import { SearchChatHistoryList } from './search-chat-history-list'

type HistoryContainerProps = {
  location: 'sidebar' | 'header'
}

const SearchChatHistoryContainer: React.FC<HistoryContainerProps> = async ({
  location
}) => {
  return (
    <div
      className={location === 'header' ? 'block sm:hidden' : 'hidden sm:block'}
    >
      <SearchChatHistory location={location}>
        <SearchChatHistoryList userId="anonymous" />
      </SearchChatHistory>
    </div>
  )
}

export default SearchChatHistoryContainer
