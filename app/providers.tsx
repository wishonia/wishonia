'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import {SessionProvider} from "next-auth/react";

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
