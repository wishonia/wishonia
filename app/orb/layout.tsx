import React from "react"

interface FrontPageLayoutProps {
  children: React.ReactNode
}
export default async function FrontPageLayout({
  children,
}: FrontPageLayoutProps) {

  return (
    <>
      {/*{user && (*/}
      {/*  <TopNavbar*/}
      {/*    user={{*/}
      {/*      name: user?.name,*/}
      {/*      image: user?.image,*/}
      {/*      email: user?.email,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
      {children}
      {/*<div style={{ height: "50px" }}></div>*/}
      {/*<Footer />*/}
    </>
  )
}
