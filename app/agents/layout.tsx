import { Providers } from "@/app/providers"
import { ChatSidebar } from "@/components/ChatSidebar"
import ChatSidebarDesktop from "@/components/ChatSidebarDesktop"
import ChatSidebarMobile from "@/components/ChatSidebarMobile"
import ChatSidebarToggle from "@/components/ChatSidebarToggle"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <Providers>
      <div className="flex h-screen w-full">
        <ChatSidebarMobile>
          <ChatSidebar />
        </ChatSidebarMobile>
        <ChatSidebarToggle />
        <ChatSidebarDesktop />
        {children}
      </div>
    </Providers>
  )
}
