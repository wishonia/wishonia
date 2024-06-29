"use client"

import Image from "next/image"
import { Sparkle, User } from "@phosphor-icons/react"
import { StreamableValue } from "ai/rsc"
import { useTheme } from "next-themes"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { useStreamableText } from "@/lib/hooks/use-streamable-text"
import { useUser } from "@/lib/useUser"
import { cn } from "@/lib/utils"

import { MemoizedReactMarkdown } from "../Markdown"
import { CodeBlock } from "../ui/code-block"
import { Skeleton } from "../ui/skeleton"
import { Spinner } from "./Spinner"

export function SpinnerMessage({ avatar }: { avatar?: string }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={`flex size-[25px] shrink-0 select-none items-center justify-center rounded-md ${avatar ? "" : "bg-primary"} overflow-hidden text-primary-foreground shadow-sm`}
      >
        {avatar ? <img src={avatar} /> : <Sparkle />}
      </div>
      <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
        {Spinner}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  avatar,
  className,
  agentName,
}: {
  content: string | StreamableValue<string>
  className?: string
  agentName?: string
  avatar?: string
}) {
  const { rawContent, isLoading } = useStreamableText(content)

  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div
        className={`flex size-[25px] shrink-0 select-none items-center justify-center rounded-md ${avatar ? "" : "bg-primary"} overflow-hidden text-primary-foreground shadow-sm`}
      >
        {avatar ? <img src={avatar} alt={agentName} /> : <Sparkle />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <span className="font-semibold">{agentName || "Talk to Wishonia"}</span>
        <MemoizedReactMarkdown
          className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-0.5 last:mb-0">{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children && children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                children[0] = (children[0] as string).replace("`▍`", "▍")
              }

              const match = /language-(\w+)/.exec(className || "")

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              )
            },
          }}
        >
          {rawContent}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const { theme } = useTheme()

  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center overflow-hidden rounded-md bg-background bg-black shadow-sm dark:bg-white">
        {!user?.image ? (
          // <Skeleton className='size-9 rounded-full' />
          <User color={theme === "light" ? "white" : "black"} />
        ) : (
          <Image src={user.image} alt="User Image" width={25} height={25} />
        )}
      </div>
      <div className="ml-4 flex flex-1 flex-col gap-2 overflow-hidden px-1">
        <span className="font-semibold">You</span>
        {children}
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <Sparkle />
      </div>
      <div className="ml-4 w-full">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  )
}
