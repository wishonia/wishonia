import React from "react"

import Footer from "@/components/layout/footer"
import { ClientTopNavbar } from "@/components/layout/ClientTopNavbar"
import { headers } from "next/headers"
import DFDALayout from "../dfda/layout"

interface FrontPageLayoutProps {
  children: React.ReactNode
}

const FrontPageLayout = async ({
  children,
}: FrontPageLayoutProps) => {
    const headersList = headers()
    const host = headersList.get('host') || ''
    if (host.includes('dfda')) {return <DFDALayout>{children}</DFDALayout>}

    return (
      <>
        <ClientTopNavbar />
        {children}
        <div style={{ height: "50px" }}></div>
        <Footer />
      </>
    )
}

export default FrontPageLayout
