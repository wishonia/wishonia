"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BookBookmark, Sparkle, Users } from "@phosphor-icons/react"
import { useActions, useUIState } from "ai/rsc"

import { AI, UIState } from "@/lib/chat/actions"
import { GithubUser } from "@/lib/types"

import AssistantDisplay from "../AssistantDisplay"
import { Button } from "../ui/button"

export function Profile({
  props: username,
  isMultiple,
}: {
  props: GithubUser
  isMultiple?: boolean
}) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { repoAction } = useActions()
  // Unique identifier for this UI component.
  const id = React.useId()

  if (!username) {
    return null
  }

  return !isMultiple ? (
    <AssistantDisplay>
      <div className="w-full rounded-md border p-3">
        <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:gap-2">
          <div className="flex w-full items-start gap-3">
            <div className="p-0.5">
              <div className="size-[45px] overflow-hidden rounded-full">
                <Image
                  src={username.avatar_url}
                  alt="User Image"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center gap-1">
                <Link
                  target="_blank"
                  href={username?.html_url ?? ""}
                  className="font-semibold leading-none text-blue-600 hover:underline "
                >
                  {username.name}
                </Link>
                <span className="text-sm font-light text-neutral-500">
                  {username.login}
                </span>
              </div>
              <span className="text-sm">
                {username.bio ? username.bio : "(No bio found)"}
              </span>

              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1 text-sm font-light text-neutral-500">
                  {username.location}
                </span>
                •
                <span className="flex items-center gap-1 text-sm text-neutral-500">
                  <span>
                    <BookBookmark size={15} />
                  </span>
                  {username.public_repos}
                </span>
                •
                <span className="flex items-center gap-1 text-sm text-neutral-500">
                  <span>
                    <Users size={17} />
                  </span>
                  {username.followers}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-1 border text-sm font-normal"
            size={"sm"}
            onClick={async () => {
              const response = await repoAction(username.login)
              setMessages((currentMessages) => [
                ...currentMessages,
                response.newMessage,
              ])
            }}
          >
            <span>
              <Sparkle />
            </span>
            Show Repositories
          </Button>
        </div>
      </div>
    </AssistantDisplay>
  ) : (
    <div className="w-full rounded-md border p-3">
      <div className="flex flex-col gap-4 md:flex md:flex-row md:justify-between md:gap-2">
        <div className="flex w-full items-start gap-3">
          <div className="p-0.5">
            <div className="size-[45px] overflow-hidden rounded-full">
              <Image
                src={username.avatar_url}
                alt="User Image"
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center gap-1">
              <Link
                target="_blank"
                href={username?.html_url ?? ""}
                className="font-semibold leading-none text-blue-600 hover:underline "
              >
                {username.name}
              </Link>
              <span className="text-sm font-light text-neutral-500">
                {username.login}
              </span>
            </div>
            <span className="text-sm">
              {username.bio ? username.bio : "(No bio found)"}
            </span>

            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 text-sm font-light text-neutral-500">
                {username.location}
              </span>
              •
              <span className="flex items-center gap-1 text-sm text-neutral-500">
                <span>
                  <BookBookmark size={15} />
                </span>
                {username.public_repos}
              </span>
              •
              <span className="flex items-center gap-1 text-sm text-neutral-500">
                <span>
                  <Users size={17} />
                </span>
                {username.followers}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-1 border text-sm font-normal"
          size={"sm"}
          onClick={async () => {
            const response = await repoAction(username.login)
            setMessages((currentMessages: UIState) => [
              ...currentMessages,
              response.newMessage,
            ])
          }}
        >
          <span>
            <Sparkle />
          </span>
          Show Repositories
        </Button>
      </div>
    </div>
  )
}
