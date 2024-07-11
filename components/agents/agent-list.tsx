"use client"

import { JSX, SVGProps, useEffect, useState } from "react"
import Link from "next/link"
import { DotsThree, Trash } from "@phosphor-icons/react"
import { Agent } from "@prisma/client"

import { useSidebar } from "@/lib/hooks/use-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { SpinningLoader } from "@/components/spinningLoader"

import { Button } from "../ui/button"

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const { isSidebarOpen } = useSidebar()

  const fetchAgents = async () => {
    setLoading(true)
    const response = await fetch("/api/agents")
    const data = await response.json()
    setAgents(data)
    setLoading(false)
  }

  const deleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })
      if (!response?.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Agent was not deleted . Please try again.",
          variant: "destructive",
        })
      }
      toast({
        description: "Your Agent has been deleted.",
      })
      fetchAgents()
    } catch {}
  }
  useEffect(() => {
    if (!loading) {
      fetchAgents()
    }
  }, [])

  return (
    <div
      className={`mx-auto h-screen scroll-m-1 overflow-auto p-2 pt-8 md:p-8 xl:max-w-[1000px]  ${isSidebarOpen ? "lg:ml-[270px] lg:w-[calc(100%-270px)]" : "w-full lg:w-[96%]"}`}
    >
      <h1 className="mb-6 text-3xl font-semibold">My Agents</h1>
      <Link href="/agents/new">
        <div className="flex w-full items-center space-x-4 rounded-sm p-4 hover:bg-secondary">
          <div>
            <PlusIcon className="h-8 w-8 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black" />
          </div>
          <div>
            <div className="font-semibold">Create a Agent</div>
            <div className="text-[#BBBBBB]">
                Create a pro-social Positron agent to improve the world.
            </div>
          </div>
        </div>
      </Link>
      <div className="border-t border-[#333333] ">
        {loading && <SpinningLoader />}
        {agents.map((agent) => {
          return (
            <div
              key={agent.id}
              className="flex justify-between rounded-sm  p-4 hover:bg-secondary"
            >
              <Link
                href={`/agents/${agent.id}/chat`}
                className="flex w-full flex-col justify-between md:flex-row md:items-center"
              >
                <div className="flex w-full items-center p-0">
                  <div className="mr-2 flex h-full items-center">
                    {agent.avatar ? (
                        <img src={agent.avatar} alt="Agent Avatar" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                        <HexagonIcon className="h-8 w-8 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black" />
                    )}
                   </div>
                  <div className="w-full overflow-hidden  text-ellipsis md:mx-4">
                    <div className="overflow-hidden  text-ellipsis font-semibold ">
                      {agent.name}
                    </div>
                    <div>
                      <p className="line-clamp-1 overflow-hidden text-ellipsis text-sm text-[#848080]">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 hidden flex-wrap justify-start md:ml-auto  md:mr-2 md:flex">
                  <Badge
                    variant="secondary"
                    className="m-1 line-clamp-1 w-max text-xs"
                  >
                    Only me
                  </Badge>
                </div>
              </Link>
              <div className="ml-1 flex items-center space-x-4">
                <Link href={`/agents/${agent.id}/edit`}>
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 px-2 font-normal"
                    >
                      <DotsThree className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup>
                      <DropdownMenuRadioItem
                        value="delete"
                        className="px-2 text-left text-sm font-bold text-red-600"
                        onSelect={() => deleteAgent(agent.id)}
                      >
                        <Trash className="mr-2" /> Delete
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DotIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.1" cy="12.1" r="1" />
    </svg>
  )
}

function HexagonIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  )
}

function PencilIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
