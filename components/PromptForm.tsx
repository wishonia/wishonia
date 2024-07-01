"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  ArrowElbowDownLeft,
  BookBookmark,
  Code,
  MagicWand,
  Plus,
  Sparkle,
  User,
} from "@phosphor-icons/react"
import { Agent } from "@prisma/client"
import { useActions, useAIState, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"

import { AI, UIState } from "@/lib/chat/actions"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { AttributeTypes } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { UserMessage } from "./assistant/Message"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

const ChatFilters = [
  {
    name: "General",
    value: "general",
    role: "assistant",
    icon: <Sparkle />,
    status: "active",
  },
  {
    name: "User Search",
    value: "user-search",
    role: "function",
    icon: <User />,
    status: "active",
  },
  {
    name: "Repository Search",
    value: "repository_search",
    role: "function",
    icon: <BookBookmark />,
    status: "active",
  },
  {
    name: "Ask About Wishonia",
    value: "ask_about_wishonia",
    role: "function",
    icon: <MagicWand />,
    status: "active",
  },
  {
    name: "Code Search",
    value: "code_search",
    role: "function",
    icon: <Code />,
    status: "disabled",
  },
]

export function PromptForm({
  input,
  setInput,
  agent,
}: {
  input: string
  setInput: (value: string) => void
  agent?: Agent | null
}) {
  const [_, setMessages] = useUIState<typeof AI>()
  const [aiState, setAIState] = useAIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [attribute, setAttribute] = React.useState("general")
  const [newAttribute, setNewAttribute] = React.useState(null)

  // Unique identifier for this UI component.
  //const id = React.useId()
  const id = nanoid() // Use a more random I'd for DB
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Set the initial attribute to general
  const message = {
    role: "system" as const,
    content: `[User has changed the attribute to general]`,

    // Identifier of this UI component, so we don't insert it many times.
    id,
  }
  if (!aiState.messages.length) {
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  // Whenever the attribute changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onAttributeChange(e: any) {
    const newValue = e

    if (newAttribute === null) return // if newAttribute is null, don't run the effect

    // Insert a hidden history info to the list.
    const message = {
      role: "system" as const,
      content: `[User has changed the attribute to ${newValue}]`,
      id,
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every attribute change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message],
      })
      return
    }

    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target["message"]?.blur()
        }

        const value = input.trim()
        setInput("")
        if (!value) return

        // Optimistically add user message UI
        setMessages((currentMessages: UIState) => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>,
          },
        ])

        // Force attributes
        // Submit and get response message
        const responseMessage = await submitUserMessage(value, agent)
        setMessages((currentMessages: UIState) => [
          ...currentMessages,
          responseMessage,
        ])
      }}
      className="mx-auto flex w-full max-w-2xl items-center"
    >
      <div className="relative bottom-0 mx-auto w-full rounded-md border bg-background p-1 shadow-xl">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute bottom-1 right-11">
            <Button
              variant="outline"
              className="flex items-center gap-1 font-normal"
            >
              {ChatFilters.find((f) => f.value === attribute)?.icon}
              {ChatFilters.find((f) => f.value === attribute)?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Choose Attribute</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={attribute}
              onValueChange={setAttribute}
            >
              {ChatFilters.map((attribute: AttributeTypes) => {
                return (
                  <DropdownMenuRadioItem
                    key={attribute.value}
                    disabled={attribute.status === "disabled"}
                    value={attribute.value}
                    className="flex items-center gap-1"
                    onSelect={() => onAttributeChange(attribute.value)}
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      <span>{attribute.icon && attribute.icon}</span>
                    </span>
                    <span>{attribute.name}</span>
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[30px] w-full resize-none border-none px-4 focus-within:outline-none focus-visible:ring-0 sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className="absolute bottom-1 right-1"
          type="submit"
          size="icon"
          disabled={input === ""}
        >
          <ArrowElbowDownLeft />
        </Button>
      </div>
      {pathname === "/" && (
        <Button onClick={() => window.location.reload()} size="icon">
          <Plus />
        </Button>
      )}
    </form>
  )
}
