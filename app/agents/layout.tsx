import { ChatHistory } from "@/components/ChatHistory"
import ChatSidebarDesktop from "@/components/ChatSidebarDesktop"
import ChatSidebarMobile from "@/components/ChatSidebarMobile"
import ChatSidebarToggle from "@/components/ChatSidebarToggle"
import { Providers } from "@/app/providers"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <Providers>
      <div className="flex h-screen w-full">
        <ChatSidebarMobile>
          <ChatHistory />
        </ChatSidebarMobile>
        <ChatSidebarToggle />
        <ChatSidebarDesktop />
        {children}
      </div>
    </Providers>
  )
}
