"use client"

import { redirect } from "next/navigation"
import * as React from "react"

export function PWARedirect() {
  // Redirect to signin page if PWA
  React.useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      redirect("/signin")
    }
  }, [])

  return null
}
