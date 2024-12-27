import SearchChatHistoryContainer from './search-chat-history-container'

export async function SearchChatSidebar() {
  return (
    <div className="h-screen p-2 fixed top-0 right-0 flex-col justify-center pb-24 hidden sm:flex">
      <SearchChatHistoryContainer location="sidebar" />
    </div>
  )
}
