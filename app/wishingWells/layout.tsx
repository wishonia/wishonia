import {generalSidebarNav} from "@/config/links"
import { getCurrentUser } from "@/lib/session"
import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"
import { SidebarNav } from "@/components/sidebar-nav"
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col space-y-6">
        {user && (
          <TopNavbar
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
            logoNavItems={generalSidebarNav.data}
          />
        )}
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <SidebarNav items={generalSidebarNav.data} />
        </aside>
        <main className="flex w-full flex-1 flex-col"
              style={{ maxWidth: "98%" }}>
            {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
