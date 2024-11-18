import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/app/search/components/theme-provider'
import Header from '@/app/search/components/header'
import Footer from '@/app/search/components/footer'
import { Sidebar } from '@/app/search/components/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { AppStateProvider } from '@/lib/utils/app-state'



const title = 'Search'
const description =
  'AI-powered answer engine with a generative UI.'

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
        <Header />
        {children}
        <Sidebar />
        <Footer />
        <Toaster />
      </AppStateProvider>
    </ThemeProvider>
  )
}
