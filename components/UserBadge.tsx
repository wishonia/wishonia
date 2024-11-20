"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Gear, SignOut } from "@phosphor-icons/react"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { signIn, signOut, useSession } from "next-auth/react"

import { avatarNav } from "@/config/navigation/general"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"

import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

function UserBadge() {
  const [position, setPosition] = React.useState("bottom")
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="size-9 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-2 w-[100px]" />
          <Skeleton className="h-2 w-[150px]" />
        </div>
      </div>
    )
  }

  return (
    <>
      {!session && (
        <Button
          onClick={() => signIn()}
          className="flex h-auto justify-start p-2 shadow-lg"
        >
          Sign In
        </Button>
      )}
      {session && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex h-auto justify-start p-2 shadow-lg"
            >
              <div className="flex w-full items-start gap-2">
                <div className="size-9 overflow-hidden rounded-full">
                  {session?.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="user"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {session?.user?.name}
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-xs font-light">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              <div className="flex w-full items-center justify-between">
                <div className="size-9 overflow-hidden rounded-full">
                  {session?.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="user"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="whitespace-nowrap text-sm font-semibold">
                      {session?.user?.name}
                    </span>
                  </div>
                  <span className="whitespace-nowrap text-xs font-light">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
              className="m-0 flex w-full flex-col gap-1"
            >
              <DropdownMenuItem className="pointer-events-none flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm opacity-50 hover:bg-muted focus:outline-none dark:hover:bg-muted">
                <span>
                  <Gear />
                </span>
                <span className="flex w-full items-center justify-between">
                  <span>Usage</span>
                  <span className="text-xs">In progress...</span>
                </span>
              </DropdownMenuItem>
              {avatarNav.data.map((item, index) => {
                const Icon = Icons[item.icon || "next"]
                return (
                  item.href && (
                    <DropdownMenuItem
                      key={index}
                      className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-muted focus:outline-none dark:hover:bg-muted"
                      asChild
                    >
                      <Link href={item.href}>
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                )
              })}
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-muted focus:outline-none dark:hover:bg-muted"
              >
                <span>
                  <SignOut />
                </span>
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

export default UserBadge
