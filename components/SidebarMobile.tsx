"use client"

import { SidebarSimple } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import Sidebar from "./Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

interface SidebarMobileProps {
  children: React.ReactNode
}

function SidebarMobile({ children }: SidebarMobileProps) {
  const { theme } = useTheme()

  return (
    <Sheet>
      <SheetTrigger className={`absolute left-0 top-0 z-30 ml-1 mt-1`}>
        <div
          className={`flex bg-transparent p-3 shadow-none focus-within:ring-0 hover:bg-transparent focus:bg-transparent focus:ring-0 lg:hidden`}
        >
          <SidebarSimple
            color={theme === "dark" ? "white" : "black"}
            size={16}
          />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[270px] flex-col p-0"
        aria-describedby={`sidebar`}
      >
        <Sidebar className="flex">{children}</Sidebar>
      </SheetContent>
    </Sheet>
  )
}

export default SidebarMobile
