"use client"

import { WandIcon } from "lucide-react"
import Link from "next/link"
import { Key } from "react"

import { Icons } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generalSidebarNav } from "@/config/navigation/general-nav"
import { siteConfig } from "@/config/site"
import { NavItem } from "@/types"



interface LogoNavMenuProps {
  navItems?: NavItem[]
}

export function LogoNavMenu({ navItems }: LogoNavMenuProps) {
  if (!navItems) {
    navItems = generalSidebarNav.data
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="inline-flex items-center">
          <WandIcon className="mr-2 h-6 w-6" />
          {siteConfig.name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {navItems.map((item: NavItem, index: Key | null | undefined) => {
          const Icon = Icons[item.icon || "next"]
          return (
            item.href && (
              <DropdownMenuItem key={index} className="cursor-pointer" asChild>
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            )
          )
        })}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
