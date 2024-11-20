import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { getDomainConfig } from "@/lib/utils/domain-config"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup")

    const hostname = req.headers.get('host')
    const domainConfig = getDomainConfig(hostname)

    // Check if we're on the root path
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL(domainConfig.defaultHomepage, req.url))
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(domainConfig.afterLoginPath, req.url))
      }
      return null
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

// This indicates which routes use this middleware
export const config = {
  matcher: ["/", "/dashboard/:path*", "/signin", "/signup"],
}
