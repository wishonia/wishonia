import { Metadata, Viewport } from "next"

import { ChatHistory } from "@/components/ChatHistory"
import SidebarDesktop from "@/components/SidebarDesktop"
import SidebarMobile from "@/components/SidebarMobile"
import SidebarToggle from "@/components/SidebarToggle"
import { Providers } from "@/app/providers"

interface ChatLayoutProps {
  children: React.ReactNode
}

const title = "Talk to Wishonia"
const description =
  "Wishonia is a magical kingdom where resources are allocated to maximize universal wish fulfillment. Talk to Wishonia's AI to learn more."
export const metadata: Metadata = {
  metadataBase: new URL("https://wishonia.love/chat"),
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    creator: "@thinkbynumbers",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
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
