import React from "react"

import Footer from "@/components/layout/footer"
import { ClientTopNavbar } from "@/components/layout/ClientTopNavbar"

interface FrontPageLayoutProps {
  children: React.ReactNode
}

const FrontPageLayout = ({
  children,
}: FrontPageLayoutProps) => {
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
