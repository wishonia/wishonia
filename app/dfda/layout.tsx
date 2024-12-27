import { Metadata } from "next"
import React from "react"

import { domainConfigs } from "@/config/domains"
import { getNavigationForDomain } from "@/config/navigation"
import { getCurrentUser } from "@/lib/session"

import DFDAFooter from "./components/DFDAFooter"
import DfdaTopNavbar from "./components/DfdaTopNavbar"

interface DFDALayoutProps {
  children: React.ReactNode
}

const dfdaConfig = domainConfigs["dfda.earth"]

export const metadata: Metadata = {
  metadataBase: new URL(dfdaConfig.url.base),
  title: {
    default: dfdaConfig.name,
    template: `%s | ${dfdaConfig.name}`,
  },
  description: dfdaConfig.description,
  keywords: dfdaConfig.keywords,
  authors: [
    {
      name: dfdaConfig.author,
      url: dfdaConfig.url.author,
    },
  ],
  creator: dfdaConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: dfdaConfig.url.base,
    title: dfdaConfig.name,
    description: dfdaConfig.description,
    siteName: dfdaConfig.name,
    images: [
      {
        url: dfdaConfig.ogImage,
        width: 1200,
        height: 630,
        alt: dfdaConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: dfdaConfig.name,
    description: dfdaConfig.description,
    images: [dfdaConfig.ogImage],
    creator: "@thinkbynumbers",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default async function DFDALayout({ children }: DFDALayoutProps) {
  const user = await getCurrentUser()
  const navigation = getNavigationForDomain("dfda.earth")

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-cyan-300 to-purple-400 p-4 font-mono text-black md:p-8">
      <DfdaTopNavbar
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
        topNavItems={navigation.topNav}
        avatarNavItems={navigation.avatarNav}
      />
      <main className="flex-1">{children}</main>
      <div className="px-4 pb-4">
        <DFDAFooter navItems={navigation.footerNav} />
      </div>
    </div>
  )
}