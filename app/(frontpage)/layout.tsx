import React from "react"

import { getCurrentUser } from "@/lib/session"
import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"

interface FrontPageLayoutProps {
  children: React.ReactNode
}
export default async function FrontPageLayout({
  children,
}: FrontPageLayoutProps) {
  const user = await getCurrentUser()

  return (
    <>
      {user && (
        <TopNavbar
          user={{
            name: user?.name,
            image: user?.image,
            email: user?.email,
          }}
        />
      )}
      {children}
      <div style={{ height: "200px" }}></div>
      <Footer />
    </>
  )
}
