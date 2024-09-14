import React from "react"

import { generalSidebarNav } from "@/config/links"
import { getCurrentUser } from "@/lib/session"
import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"
import { SidebarNav } from "@/components/sidebar-nav"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <div className="flex flex-1">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SidebarNav items={generalSidebarNav.data} />
        </aside>
        <main className="flex-1 px-4 py-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
