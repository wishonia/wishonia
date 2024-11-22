"use client"

import { Key } from "react"
import Image from "next/image"
import Link from "next/link"
import { NavItem } from "@/types"

import { dfdaNavigation } from "@/config/navigation/domains/dfda-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

interface LogoNavMenuProps {
  navItems?: NavItem[]
}

export function DfdaLogoNavMenu({ navItems }: LogoNavMenuProps) {
  if (!navItems) {
    navItems = dfdaNavigation.sidebarNav
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="inline-flex items-center">
          <Image
            src="/globalSolutions/dfda/dfda-wide-text-logo-white-background.png"
            alt="DFDA Logo"
            width={200}
            height={40}
            className="h-auto"
          />
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
