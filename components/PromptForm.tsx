"use client"

import * as React from "react"
import { ArrowElbowDownLeft, Plus } from "@phosphor-icons/react"
import { Agent, Tool, ToolType } from "@prisma/client"
import { useActions, useAIState, useUIState } from "ai/rsc"
import { nanoid } from "nanoid"

import { AI, UIState } from "@/lib/chat/actions"
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit"
import { DEFAULT_TOOLS, toolFunctions } from "@/lib/tools/functions"
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

type ToolWithConfig = Tool & {
  toolConfig: {
    functions: string[] 
  }
}

export function PromptForm({
  input,
  setInput,
  agent,
  pathname,
}: {
  input: string
  setInput: (value: string) => void
  agent?: Agent & { tools?: ToolWithConfig[] } | null
  pathname: string
}) {
  const [_, setMessages] = useUIState<typeof AI>()
  const [aiState, setAIState] = useAIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [selectedTool, setSelectedTool] = React.useState<string>("")
  const [newTool, setNewTool] = React.useState(null)

  const id = nanoid()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Get available tools - either from agent or defaults
  const availableTools = React.useMemo(() => {
    return agent?.tools?.length ? agent.tools : DEFAULT_TOOLS
  }, [agent?.tools])

  // Set the initial tool to the first available tool
  React.useEffect(() => {
    if (availableTools.length && !selectedTool) {
      setSelectedTool(availableTools[0].id)
      const message = {
        role: "system" as const,
        content: `[User has selected tool ${availableTools[0].name}]`,
        id,
      }
      setAIState({ ...aiState, messages: [...aiState.messages, message] })
    }
  }, [availableTools, selectedTool, aiState, setAIState])

  // Update AI state when tool changes
  function onToolChange(toolId: string) {
    const tool = agent?.tools?.find(t => t.id === toolId)
    if (!tool || !toolFunctions[tool.type]) {
      console.warn(`Tool ${tool?.type} not implemented`)
      return
    }

    const message = {
      role: "system" as const,
      content: `[User has selected tool ${tool.name}]`,
      id,
    }

    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message],
      })
      return
    }

    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const [rows, setRows] =
      React.useState(1); // Start with 1 row

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaLineHeight = 24; // Adjust based on your CSS
    const previousRows = e.target.rows;
    e.target.rows = 1; // Reset rows to calculate scrollHeight

    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setRows(currentRows);
  };

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        setRows(1);
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
              {availableTools.find(t => t.id === selectedTool)?.name || "Select Tool"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Choose Tool</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedTool}
              onValueChange={setSelectedTool}
            >
              {availableTools.map((tool) => (
                <DropdownMenuRadioItem
                  key={tool.id}
                  value={tool.id}
                  className="flex items-center gap-1"
                  onSelect={() => onToolChange(tool.id)}
                >
                  <span>{tool.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onInput={handleInput}
          placeholder="Send a message."
          className="min-h-[30px] w-full resize-none border-none px-4 focus-within:outline-none focus-visible:ring-0 sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={rows}
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
