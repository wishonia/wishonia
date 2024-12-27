"use client"

import { Building2 } from "lucide-react"
import { Menu } from "lucide-react"
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

import { ModeToggle } from "./mode-toggle"



const components: { title: string; href: string; description: string }[] = [
  {
    title: "Mission & Vision",
    href: "/dih/about",
    description: "Our mission to improve health outcomes globally through decentralized governance.",
  },
  {
    title: "Three Pillars",
    href: "/dih/about#pillars",
    description: "dFDA, Medical Freedom, and Optimal Incentives - the foundation of our approach.",
  },
  {
    title: "Roadmap",
    href: "/dih/about#roadmap",
    description: "Our journey from concept to global implementation.",
  },
]

export function Navigation() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/dih/" className="flex items-center space-x-2 mr-6">
          <Building2 className="h-6 w-6" />
          <span className="font-bold">dIH</span>
        </Link>
        
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dfda/docs/cure-acceleration-act" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blueprint
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dfda" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Data Hub
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/dfda/trials" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Clinical Trials
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="p-2">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                {components.map((component) => (
                  <Link 
                    key={component.title} 
                    href={component.href}
                    className="text-sm text-muted-foreground pl-4"
                  >
                    {component.title}
                  </Link>
                ))}
                <Link href="/dfda/docs/cure-acceleration-act" className="text-lg font-medium">
                  Blueprint
                </Link>
                <Link href="/dfda" className="text-lg font-medium">
                  dFDA
                </Link>
                <Link href="/dfda/trials" className="text-lg font-medium">
                  Clinical Trials
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"