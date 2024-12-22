import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/app/search/components/theme-provider'
import SearchChatHeader from '@/app/search/components/searchChatHeader'
import SearchChatFooter from '@/app/search/components/searchChatFooter'
import { SearchChatSidebar } from '@/app/search/components/searchChatSidebar'
import { Toaster } from '@/components/ui/sonner'
import { AppStateProvider } from '@/lib/utils/app-state'



const title = 'Search'
const description = 'Search'

export const metadata: Metadata = {
  metadataBase: new URL('https://wishonia.love'),
  title,
  description,
  openGraph: {
    title,
    description
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@thinknbynumbers'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default function SearchLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppStateProvider>
        <SearchChatHeader />
        {children}
        <SearchChatSidebar />
        <SearchChatFooter />
        <Toaster />
      </AppStateProvider>
    </ThemeProvider>
  )
}
