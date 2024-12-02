import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

import { redirects } from "@/config/redirects"
import { getDomainConfig } from "@/lib/utils/domain-config"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const pathname = req.nextUrl.pathname

    // Check redirects first
    const redirect = redirects.find(r => r.source === pathname)
    if (redirect) {
      // Create new URL with the destination
      const newUrl = new URL(redirect.destination, req.url)
      
      // Preserve query parameters
      const searchParams = new URLSearchParams(req.nextUrl.search)
      searchParams.forEach((value, key) => {
        newUrl.searchParams.set(key, value)
      })

      // Preserve hash fragment
      if (req.nextUrl.hash) {
        newUrl.hash = req.nextUrl.hash
      }

      return NextResponse.redirect(
        newUrl,
        redirect.permanent ? { status: 308 } : { status: 307 }
      )
    }

    const isAuthPage =
      req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup")

    const hostname = req.headers.get("host")
    const domainConfig = getDomainConfig(hostname)

    // Check if we're on the root path
    if (req.nextUrl.pathname === "/") {
      // Only redirect if defaultHomepage is not root path
      if (domainConfig.defaultHomepage !== "/") {
        return NextResponse.redirect(
          new URL(domainConfig.defaultHomepage, req.url)
        )
      }
      return null
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(
          new URL(domainConfig.afterLoginPath, req.url)
        )
      }
      return null
    }

    return null
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

// Update matcher to include all redirect sources
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/signin",
    "/signup",
    ...redirects.map(r => r.source),
  ],
}
