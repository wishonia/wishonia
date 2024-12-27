"use client"

import Image from "next/image"
import Link from "next/link"
import { Key, KeyboardEvent, useRef, useState } from "react"

import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { dfdaNavigation } from "@/config/navigation/domains/dfda-nav"
import { NavItem } from "@/types"

interface LogoNavMenuProps {
  navItems?: NavItem[]
}

export function DfdaLogoNavMenu({ navItems }: LogoNavMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!navItems) {
    navItems = dfdaNavigation.sidebarNav
  }

  const filteredItems = navItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Prevent arrow keys from navigating the dropdown while typing
    if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
      e.stopPropagation()
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={true}>
      <DropdownMenuTrigger>
        <span className="inline-flex items-center border-2 border-black bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Image
            src="/globalSolutions/dfda/dfda-wide-text-logo-transparent-4-light-background.svg"
            alt="DFDA Logo"
            width={200}
            height={40}
            className="h-auto"
          />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[300px]"
        onCloseAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <div className="px-2 py-2" onKeyDown={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-auto">
          {filteredItems.map((item: NavItem, index: Key | null | undefined) => {
            const Icon = Icons[item.icon || "next"]
            return (
              item.href && (
                <DropdownMenuItem
                  key={index}
                  className="cursor-pointer"
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              )
            )
          })}
          {filteredItems.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
