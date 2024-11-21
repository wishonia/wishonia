import React from "react"

import { getCurrentUser } from "@/lib/session"
import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"

import RateLimitStatus from "./[org]/[repo]/components/RateLimitStatus"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <TopNavbar
        user={{
          name: user?.name,
          image: user?.image,
          email: user?.email,
        }}
      />
      <div className="container">
        <main className="flex w-full flex-1 flex-col">{children}</main>
      </div>
      <div className="fixed bottom-4 right-4">
        <RateLimitStatus />
      </div>
      <Footer />
    </div>
  )
}
