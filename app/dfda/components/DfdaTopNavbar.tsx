"use client"

import Link from "next/link"
import { User } from "next-auth"
import React from "react"

import { UserNavDisplay } from "@/components/user/user-nav-display"
import { getNavigationForDomain } from "@/config/navigation"
import { NavItem } from "@/types"

import { DfdaLogoNavMenu } from "./dfda-logo-nav"

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  domain?: string
  logoNavItems?: NavItem[]
  topNavItems?: NavItem[]
  avatarNavItems?: NavItem[]
}

export default function DfdaTopNavbar({
  user,
  domain = "dfda.earth",
  logoNavItems,
  topNavItems,
  avatarNavItems,
}: NavbarProps) {
  const navigation = getNavigationForDomain(domain)

  if (!topNavItems) {
    topNavItems = navigation.topNav
  }
  if (!avatarNavItems) {
    avatarNavItems = navigation.avatarNav
  }

  const isExternalLink = (href: string) => {
    return href.startsWith("http://") || href.startsWith("https://")
  }

  return (
    <header className="select-none">
      <nav className="mx-auto flex items-center justify-between lg:max-w-7xl">
        <div>
          <div className="flex items-center justify-between py-3 md:block md:py-5">
            <DfdaLogoNavMenu navItems={logoNavItems} />
          </div>
        </div>
        <div className="hidden md:block">
          <div
            className="absolute left-0 right-0 z-10 m-auto justify-self-center rounded-md border p-4 md:static md:mt-0 md:border-none md:p-0"
            style={{ width: "100%", maxWidth: "20rem" }}
          >
            <ul className="flex flex-col items-center space-y-4 opacity-60 md:flex-row md:space-x-6 md:space-y-0">
              {topNavItems.map((item, index) => {
                return (
                  item.href && (
                    <Link
                      key={index}
                      href={item.disabled ? "/" : item.href}
                      className="hover:underline"
                      {...(isExternalLink(item.href)
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      {item.title}
                    </Link>
                  )
                )
              })}
            </ul>
          </div>
        </div>
        <UserNavDisplay
          user={{
            name: user?.name,
            image: user?.image,
            email: user?.email,
          }}
          avatarNavItems={avatarNavItems}
          buttonVariant="neobrutalist"
        />
      </nav>
    </header>
  )
}
