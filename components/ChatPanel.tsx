"use client"

import { ArrowRight, MagicWand } from "@phosphor-icons/react"
import { Agent } from "@prisma/client"
import { useActions, useAIState, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"

import { AI } from "@/lib/chat/actions"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useUser } from "@/lib/useUser"
import { exampleMessages } from "@/components/ChatExampleQuestions"

import { UserMessage } from "./assistant/Message"
import {useRouter} from "next/navigation";

function ChatPanel({ agentData }: { agentData?: Agent | null }) {
  const [aiState] = useAIState()
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { isSignedIn, user } = useUser()
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()
const router = useRouter();
  if (agentData) {
    return (
      <div
        className={`${messages.length === 0 ? "absolute left-0 right-0 mx-auto mb-20 block px-2 sm:px-0" : "hidden"} ${!isSidebarOpen || !isSignedIn ? "" : "lg:translate-x-[100px]"} mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-5 transition-all duration-300`}
      >
        <div
          className={`${messages.length > 0 ? "hidden" : "block"} z-10 mx-auto flex w-full flex-col items-center justify-center gap-4`}
        >
          <h1 className="flex items-center whitespace-nowrap text-4xl font-extrabold leading-none tracking-wider md:text-[65px]">
            <MagicWand />
            <span className="bg-gradient-to-t from-black/50 to-black bg-clip-text text-transparent dark:from-white/50 dark:to-white">
              {agentData.name}
            </span>
          </h1>
          <p className="block px-6 text-center text-xs tracking-normal text-zinc-600 md:text-sm">
            {agentData.description}
          </p>
          {user?.id === agentData?.userId && (
              <button
                  className="mt-2 px-4 py-2"
                  onClick={() => router.push(`/agents/${agentData.id}/edit`)}
              >
                Edit Agent
              </button>
          )}
        </div>
        <div
          className={`${messages.length > 0 ? "hidden" : "block"} mx-auto w-full`}
        >
          <div className="flex flex-col gap-2 px-4">
            {agentData?.conversationStarters?.map((text) => (
              <div
                key={text}
                className={`cursor-pointer rounded-md bg-white p-3 transition-all duration-300 hover:translate-x-3 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900

            `}
                onClick={async () => {
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{text}</UserMessage>,
                    },
                  ])

                  const responseMessage = await submitUserMessage(
                    text,
                    agentData
                  )

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ])
                }}
              >
                <div className="flex items-center gap-2 text-xs font-extralight tracking-wide md:text-sm">
                  <ArrowRight />
                  <span className="space-x-1">
                    <span className="font-medium">{text}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      className={`${messages.length === 0 ? "mt-10 block px-2 sm:mt-60 sm:px-0" : "hidden"} ${!isSidebarOpen || !isSignedIn ? "" : "lg:translate-x-[100px]"} mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-5 transition-all duration-300`}
    >
      <div
        className={`${messages.length > 0 ? "hidden" : "block"} z-10 mx-auto flex w-full flex-col items-center justify-center gap-4`}
      >
        <h1
          className="flex items-center text-4xl
         font-extrabold leading-none tracking-wider md:text-[65px]"
        >
          <MagicWand />
          <span
            className="
          bg-gradient-to-t from-black/50 to-black bg-clip-text text-transparent dark:from-white/50 dark:to-white"
          >
            Talk to Wishonia
          </span>
        </h1>
        <p
          className={`${isSignedIn ? "hidden" : "block"} px-6 text-center text-xs tracking-normal text-zinc-600 md:text-sm`}
        >
          Actions related to GitHub are tightly rate-limited. Please sign in
          with GitHub not to get rate-limited.
        </p>
      </div>
      <div
        className={`${messages.length > 0 ? "hidden" : "block"} mx-auto w-full`}
      >
        <div className="flex flex-col gap-2 px-4">
          {exampleMessages.map((example, index) => (
            <div
              key={example.heading}
              className={`cursor-pointer rounded-md bg-white p-3 transition-all duration-300 hover:translate-x-3 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900

            `}
              onClick={async () => {
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{example.message}</UserMessage>,
                  },
                ])

                const responseMessage = await submitUserMessage(example.message)

                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ])
              }}
            >
              <div className="flex items-center gap-2 text-xs font-extralight tracking-wide md:text-sm">
                <ArrowRight />
                <span className="space-x-1">
                  <span className="font-medium">{example.heading}</span>
                  <span className="">{example.subheading}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
