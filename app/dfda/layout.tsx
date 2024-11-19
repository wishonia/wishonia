import React from "react"

import { getCurrentUser } from "@/lib/session"
import DfdaTopNavbar from "./components/DfdaTopNavbar"
import DFDAFooter from './components/DFDAFooter'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-cyan-300 to-purple-400 p-4 font-mono text-black md:p-8">
      <DfdaTopNavbar
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <main className="flex-1">
        {children}
      </main>
      <div className="px-4 pb-4">
        <DFDAFooter />
      </div>
    </div>
  )
}
