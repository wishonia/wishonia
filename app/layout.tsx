import "./globals.css";
import "@/app/styles/neobrutalist.css";

import { CopilotKit } from "@copilotkit/react-core";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/app/providers"; // Import Providers
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@FDADAO",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url.base}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={cn("antialiased", spaceGrotesk.className)}>
        <Providers> {/* Wrap the application with Providers */}
          <CopilotKit url="/api/copilot/openai/">
            <NextTopLoader color="#DC2645" height={2.5} showSpinner={false} />
            <div
              vaul-drawer-wrapper=""
              className="flex min-h-screen flex-col bg-background"
            >
              {children}
            </div>
            <Toaster />
          </CopilotKit>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
