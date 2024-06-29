import { Key } from "react"
import Link from "next/link"
import { NavItem } from "@/types"

import { generalFooterNav } from "@/config/links"
import { Icons } from "@/components/icons"

interface FooterProps {
  footerNavItems?: NavItem[]
}

export default function Footer({ footerNavItems }: FooterProps) {
  const footerLinks = footerNavItems || generalFooterNav.data

  return (
    <footer className="mx-auto  mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          {/*          <Link href="/">
          <h1 className="mb-2 text-2xl font-bold sm:mb-0">
            {siteConfig.name}
          </h1>
        </Link>*/}
          <ul className="mb-6 flex flex-wrap items-center justify-center opacity-60 sm:mb-0">
            {footerLinks.map((item: NavItem, index: Key | null | undefined) => {
              const Icon = Icons[item.icon || "next"]
              return (
                item.href && (
                  <li key={index} className={"p-2"}>
                    <Link
                      href={item.disabled ? "/" : item.href}
                      className="mr-4 hover:underline md:mr-6"
                    >
                      <span className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </span>
                    </Link>
                  </li>
                )
              )
            })}
          </ul>
        </div>
        <hr className="my-6 text-muted-foreground sm:mx-auto" />
        <div className="flex items-center justify-center">
          <div className="block text-sm text-muted-foreground sm:text-center">
            © {new Date().getFullYear()}{" "}
            <a
              target="_blank"
              href="https://github.com/Wishonia"
              className="hover:underline"
            >
              Wishonia
            </a>
            . Everyone's Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
