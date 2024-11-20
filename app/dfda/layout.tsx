import React from "react"

import { getNavigationForDomain } from "@/config/navigation"
import { getCurrentUser } from "@/lib/session"

import DFDAFooter from "./components/DFDAFooter"
import DfdaTopNavbar from "./components/DfdaTopNavbar"

interface DFDALayoutProps {
  children: React.ReactNode
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