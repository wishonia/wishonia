"use client"

import { JSX, SVGProps, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Agent } from "@prisma/client"

import { useSidebar } from "@/lib/hooks/use-sidebar"
import {SpinningLoader} from "@/components/spinningLoader";

export default function AgentListPublished() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const { isSidebarOpen } = useSidebar()
  const router = useRouter()

  const fetchAgents = async () => {
    setLoading(true)
    const response = await fetch("/api/agents")
    const data = await response.json()
    setAgents(data)
    setLoading(false)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Positron Agents</h1>
        <button
          onClick={() => router.push('/agents/mine')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          My Agents
        </button>
      </div>
      <Link href="/agents/new">
        <div className="flex w-full items-center space-x-4 rounded-sm p-4 hover:bg-secondary">
          <div>
            <PlusIcon className="h-8 w-8 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black" />
          </div>
          <div>
            <div className="font-semibold">Create a Positron Agent</div>
            <div className="text-[#BBBBBB]">
                Create a pro-social AI agent to improve the world.
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
                        <img src={agent.avatar} alt={`Avatar of ${agent.name}`} className="h-8 w-8 rounded-full object-cover" />
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
              </Link>
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