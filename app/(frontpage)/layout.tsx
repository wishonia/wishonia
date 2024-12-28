import { headers } from "next/headers"
import React from "react"

import Footer from "@/components/layout/footer"
import TopNavbar from "@/components/layout/topNavbar"
import { getCurrentUser } from "@/lib/session"

import CureDAOLayout from "../curedao/layout"
import DFDALayout from "../dfda/layout"

interface FrontPageLayoutProps {
  children: React.ReactNode
}

const FrontPageLayout = async ({
  children,
}: FrontPageLayoutProps) => {
    const headersList = headers()
    const host = headersList.get('host') || ''
    if ( host.includes('curedao')) {return <CureDAOLayout>{children}</CureDAOLayout>}
    if (host.includes('dfda')) {return <DFDALayout>{children}</DFDALayout>}
    
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
        <div style={{ height: "50px" }} />
        <Footer />
      </>
    )
}

export default FrontPageLayout
