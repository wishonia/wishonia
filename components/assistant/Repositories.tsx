"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkle, Star } from "@phosphor-icons/react"
import { useActions, useUIState } from "ai/rsc"

import { AI } from "@/lib/chat/actions"
import { COLOURS } from "@/lib/constants"
import { RepoProps } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AssistantDisplay from "../AssistantDisplay"
import License from "../icons/License"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

function Repositories({ props: repos }: { props: RepoProps[] }) {
  const { readmeAction } = useActions()
  const [action, setAction] = React.useState("")
  const [messages, setMessages] = useUIState<typeof AI>()

  function findColour(language: string): string {
    const entry = Object.entries(COLOURS).find(([key]) => key === language)
    if (entry) {
      if (entry[0] !== undefined && entry[0] !== "" && entry[0] === language) {
        return entry[1].color
      }
      return "#000000"
    }
    return "#000000"
  }

  const RepoActions = [
    {
      name: "Show Readme",
      value: "show_readme",
      function: async (repo: string, owner: string) => {
        const response = await readmeAction(repo, owner)
        setMessages((currentMessages: any) => [
          ...currentMessages,
          response.newMessage,
        ])
      },
      status: "active",
    },
    {
      name: "Code Search",
      value: "code_search",
      function: async () => {},
      status: "disabled",
    },
  ]

  return (
    <AssistantDisplay>
      {Array.isArray(repos) &&
        repos.map((r, index) => {
          return (
            <div className="mb-2 w-full rounded-md border p-3" key={index}>
              <div className="flex flex-col items-start justify-between gap-3 md:flex-row">
                <div className="flex gap-2">
                  <div className="p-0.5">
                    <div className="size-[25px] overflow-hidden rounded-md">
                      <Image
                        src={r.owner.avatar_url}
                        alt="User Image"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Link
                        target="_blank"
                        href={r.html_url ?? ""}
                        className="font-semibold leading-none text-blue-600 hover:underline"
                      >
                        {r.full_name}
                      </Link>
                    </div>
                    <span className="text-sm">
                      {r.description ? r.description : "(No description found)"}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {r.topics.map((topic, index) => {
                        return (
                          <Badge
                            variant="secondary"
                            className="font-normal"
                            key={index}
                          >
                            {topic}
                          </Badge>
                        )
                      })}
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        <div
                          style={{
                            backgroundColor: findColour(r.language),
                          }}
                          className={`size-2.5 rounded-full`}
                        ></div>
                        <span className="flex items-center gap-1 text-sm font-light text-neutral-500">
                          {r.language}
                        </span>
                      </div>
                      •
                      <span className="flex items-center gap-0.5 text-sm font-light text-neutral-500">
                        <span>
                          <Star size={15} />
                        </span>
                        {r.stargazers_count.toString().split("").length > 3 ? (
                          <span> {Math.floor(r.stargazers_count / 1000)}k</span>
                        ) : (
                          <span>{r.stargazers_count}</span>
                        )}
                      </span>
                      •
                      <span className="flex items-center gap-1 text-sm text-neutral-500">
                        <span>
                          <License />
                        </span>
                        <span className="font-light">
                          {r?.license?.spdx_id !== null ||
                          r?.license?.spdx_id !== undefined
                            ? r?.license?.spdx_id
                            : "No License"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="flex w-full justify-end md:w-min"
                  >
                    <Button
                      variant="ghost"
                      size={"sm"}
                      className="flex items-center justify-center gap-1 border text-sm font-normal"
                    >
                      <span>
                        <Sparkle />
                      </span>
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Choose Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={action}
                      onValueChange={setAction}
                    >
                      {RepoActions.map((action) => {
                        return (
                          <DropdownMenuRadioItem
                            disabled={action.status === "disabled"}
                            key={action.value}
                            value={action.value}
                            className="cursor-pointer p-2"
                            onSelect={async () => {
                              if (action.value === "show_readme") {
                                await action.function(r.name, r.owner.login)
                              } else if (action.value === "show-directory") {
                                await action.function(r.name, r.owner.login)
                              }
                            }}
                          >
                            {action.name}
                          </DropdownMenuRadioItem>
                        )
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
    </AssistantDisplay>
  )
}

export default Repositories
