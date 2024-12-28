"use client"

import {
  GithubLogo,
  Globe,
  LinkSimple,
  SignIn,
} from "@phosphor-icons/react"
import Link from "next/link"
import * as React from "react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

const components: { title: string; href: string; icon: any }[] = [
  {
    title: siteConfig.name,
    href: siteConfig.url.base || "",
    icon: <Globe size={18} />,
  },
  ...(siteConfig.links.github
    ? [
        {
          title: "GitHub",
          href: siteConfig.links.github,
          icon: <GithubLogo size={18} />,
        },
      ]
    : []),
]

export default function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/sign-in" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <span className="flex items-center space-x-1.5">
                <span>
                  <SignIn size={18} />
                </span>
                <span className="text-xs">Login</span>
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className="flex items-center space-x-1.5">
              <span>
                <LinkSimple size={18} />
              </span>
              <span className="text-xs">Links</span>
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex w-full flex-col items-start gap-1 p-2">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  href={component.href}
                  target="_blank"
                  className="flex w-full items-center gap-2 px-2 py-1"
                  title={component.title}
                >
                  <span>{component.icon}</span>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="w-full">
      <NavigationMenuLink className="w-full" asChild>
        <a
          ref={ref}
          className={cn(
            "flex w-full select-none items-start rounded-md no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <p className="text-xs text-muted-foreground">{children}</p>
          <div className="text-xs font-medium ">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
