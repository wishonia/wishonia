import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { env } from "./env.mjs"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/signin") ||
      req.nextUrl.pathname.startsWith("/signup")

    // Use the environment variable for the default redirect, fallback to "/dashboard"
    const defaultRedirect = env.NEXT_PUBLIC_DEFAULT_AFTER_LOGIN_PATH || "/dashboard"

    // Check for the custom homepage
    const customHomepage = env.NEXT_PUBLIC_DEFAULT_HOMEPAGE

      console.log(`customHomepage is: ${customHomepage}  and current url is: ${req.nextUrl.pathname}`)

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(defaultRedirect, req.url))
      }
      return null
    }

    // Redirect to custom homepage if set and on root path
    if (req.nextUrl.pathname === "/" && customHomepage) {
      return NextResponse.redirect(new URL(customHomepage, req.url))
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
