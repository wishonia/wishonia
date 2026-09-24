"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeProviderProps } from "next-themes/dist/types"

import { SidebarProvider } from "@/lib/hooks/use-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
