"use client"

import React from "react"
import { Check, Copy, File, FolderSimple } from "@phosphor-icons/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { useDecoder } from "@/lib/hooks/use-decoder"
import { useGetDirectoryContent } from "@/lib/hooks/use-get-directory-content"
import { Directory as Dir } from "@/lib/types"
import { useUserIdClient } from "@/lib/useUserIdClient"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import AssistantDisplay from "../AssistantDisplay"
import { Button } from "../ui/button"

export default function Directory({ props: directory }: { props: Dir[] }) {
  const userId = useUserIdClient()

  return (
    <AssistantDisplay>
      <Accordion type="single" collapsible className="">
        <div className="rounded-md border p-2">
          {Array.isArray(directory) &&
            directory
              .sort((a, b) => {
                if (a.type === "dir" && b.type === "file") {
                  return -1
                } else if (a.type === "file" && b.type === "dir") {
                  return 1
                } else {
                  return 0
                }
              })
              .map((dir, index) => {
                return dir.type === "file" ? (
                  <AccordionItem
                    value={`item-${index}`}
                    className=" w-full gap-1 text-sm font-semibold last:border-none"
                    key={index}
                  >
                    <AccordionTrigger className="justify-start gap-2 p-2 text-sm font-semibold">
                      <span className="flex items-center gap-1">
                        <File size={18} color="#c2c2c2" weight="fill" />
                        <span>{dir.name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <DropdownFileContent
                        url={dir.url}
                        userId={userId}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <AccordionItem
                    value={`item-${index}`}
                    className="w-full gap-1 text-sm font-semibold last:border-none"
                    key={index}
                  >
                    <AccordionTrigger className="justify-start gap-2 p-2 text-sm font-semibold">
                      <span className="flex items-center gap-1">
                        <FolderSimple size={18} color="#c2c2c2" weight="fill" />
                        <span>{dir.name}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <DropdownContent url={dir._links.self} userId={userId} />
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
        </div>
      </Accordion>
    </AssistantDisplay>
  )
}

function DropdownContent({ url, userId }: { url: string; userId?: string }) {
  const data = useGetDirectoryContent(url)
  if (!data) {
    return null
  }
  const { fetchedData, isLoading } = data

  return (
    <Accordion type="single" collapsible className="ml-5">
      {fetchedData &&
        Array.isArray(fetchedData) &&
        fetchedData
          .sort((a, b) => {
            if (a.type === "dir" && b.type === "file") {
              return -1
            } else if (a.type === "file" && b.type === "dir") {
              return 1
            } else {
              return 0
            }
          })
          .map((item, index) => {
            return item.type === "file" ? (
              <AccordionItem
                value={`item-${index}`}
                className="w-full gap-1 p-2 text-sm font-semibold "
                key={index}
              >
                <AccordionTrigger
                  value={`item-${index}`}
                  key={index}
                  className=" ml-1.5 flex justify-start p-0"
                >
                  <span className="ml-2 flex items-center gap-1">
                    <File size={18} color="#c2c2c2" weight="fill" />
                    <span>{item.name}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <DropdownFileContent
                    url={item.url}
                    userId={userId}
                  />
                </AccordionContent>
              </AccordionItem>
            ) : (
              <AccordionItem value={`item-${index}`} key={index} className="">
                <AccordionTrigger className="ml-1.5 justify-start gap-2 p-2 text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    <FolderSimple size={18} color="#c2c2c2" weight="fill" />
                    <span>{item.name}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <DropdownContent url={item._links.self} userId={userId} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
    </Accordion>
  )
}

function DropdownFileContent({
  url,
  className,
  userId,
}: {
  url: string
  className?: string
  userId?: string
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const data = useDecoder(url, userId)

  if (!data) {
    return null
  }

  const { fetchedData } = data

  const match = /language-(\w+)/.exec(className || "")

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(fetchedData)
  }

  return (
    <div className="codeblock relative mt-4 rounded-md border bg-zinc-950 font-sans md:w-full">
      <div className="flex w-full items-center justify-between rounded-t-md bg-zinc-800 px-6 py-1 pr-2 text-zinc-100">
        <span className="text-xs lowercase">{(match && match[1]) || ""}</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0 dark:hover:bg-gray-500/20"
            onClick={onCopy}
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>
      <SyntaxHighlighter
        language={(match && match[1]) || ""}
        style={vscDarkPlus}
        PreTag="div"
        showLineNumbers
        customStyle={{
          margin: 0,
          width: "100%",
          height: "300px",
          background: "transparent",
          padding: "1.5rem 1rem",
          overflowX: "scroll",
          overflowY: "scroll",
        }}
        lineNumberStyle={{
          userSelect: "none",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
          },
        }}
      >
        {fetchedData}
      </SyntaxHighlighter>
    </div>
  )
}
