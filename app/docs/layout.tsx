import React from "react"

import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"
import { getCurrentUser } from "@/lib/session"

import GithubRequestLogs from "./[org]/[repo]/components/GithubRequestLogs"
import RateLimitStatus from "./[org]/[repo]/components/RateLimitStatus"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()
  const isDevelopment = process.env.NODE_ENV === "development"

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
      {isDevelopment && (
        <>
          <div className="fixed bottom-4 right-4 z-50">
            <RateLimitStatus />
          </div>
          <div className="fixed bottom-20 right-4 z-50">
            <GithubRequestLogs />
          </div>
        </>
      )}
      <Footer />
    </div>
  )
}
