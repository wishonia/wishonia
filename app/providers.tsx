"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProviderProps } from "next-themes/dist/types"

import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/lib/hooks/use-sidebar"

const queryClient = new QueryClient()

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SidebarProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
