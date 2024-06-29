"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

import { SidebarProvider } from "@/lib/hooks/use-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const queryClient = new QueryClient()

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider {...props}>
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
