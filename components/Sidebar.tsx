"use client"

import { useSidebar } from "@/lib/hooks/use-sidebar"
import { cn } from "@/lib/utils"

export type SidebarProps = React.ComponentProps<"div">

function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  return (
    <div
      data-state={isSidebarOpen && !isLoading ? "open" : "closed"}
      className={cn(className, "h-full w-full flex-col dark:bg-zinc-950")}
    >
      {children}
    </div>
  )
}

export default Sidebar
