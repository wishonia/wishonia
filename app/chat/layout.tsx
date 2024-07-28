import { ChatHistory } from "@/components/ChatHistory"
import SidebarDesktop from "@/components/SidebarDesktop"
import SidebarMobile from "@/components/SidebarMobile"
import SidebarToggle from "@/components/SidebarToggle"
import { Providers } from "@/app/providers"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <Providers>
      <div className="flex h-screen w-full">
        <SidebarMobile>
          <ChatHistory />
        </SidebarMobile>
        <SidebarToggle />
        <SidebarDesktop />
        {children}
      </div>
    </Providers>
  )
}
