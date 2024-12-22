"use client"

import { CaretLeft } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import { useSidebar } from "@/lib/hooks/use-sidebar"

import { Button } from "./ui/button"

function ChatSidebarToggle() {
  const { theme } = useTheme()
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  return (
    <Button
      size="icon"
      className={`${isSidebarOpen ? "translate-x-[275px] transition-all duration-300" : "transition-all duration-300"} absolute inset-y-1/2 left-0 z-50 hidden bg-transparent p-0 shadow-none hover:bg-transparent lg:flex`}
      onClick={() => toggleSidebar()}
    >
      <CaretLeft
        color={theme === "dark" ? "white" : "black"}
        size={18}
        className={`${isSidebarOpen ? "transition-all duration-300" : "rotate-180 transition-all duration-300"}`}
      />
    </Button>
  )
}

export default ChatSidebarToggle
