"use client"

import { useCompletion } from "ai/react"
import {
  CornerDownLeft,
  Frown,
  Loader,
  Sparkle,
  User,
  Wand,
  X,
} from "lucide-react"
import * as React from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

import { ExampleQueryButton } from "@/components/search-dialog/ui/ExampleQueryButton"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"

export function AskAISearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>("")

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/vector-search",
  })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen(true)
      }

      if (e.key === "Escape") {
        console.log("esc")
        handleModalToggle()
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function handleModalToggle() {
    setOpen(!open)
    setQuery("")
  }

  function setQueryAndSubmit(query: string) {
    setQuery(query)
    complete(query)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(query)
    complete(query)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative z-50 flex min-w-[300px] items-center gap-2 rounded-md border
        border-slate-200 px-4  py-2 text-base
        text-slate-500
        transition-colors
        hover:border-slate-300 hover:text-slate-700 dark:border-slate-500 dark:text-slate-400 dark:hover:border-slate-500
        dark:hover:text-slate-300 "
      >
        <Sparkle width={15} />
        <span className="h-5 border border-l" />
        <span className="ml-4 inline-block">Ask AI...</span>
      </button>
      <Dialog open={open}>
        <DialogContent className="max-h-[90vh] w-[90vw] max-w-[500px] overflow-y-auto overflow-x-hidden text-black">
          <DialogHeader>
            <DialogTitle>Talk to Wishonia</DialogTitle>
            <DialogDescription>
              Learn about how we can solve coordination problems and maximize
              universal wish fulfilment.
            </DialogDescription>
            <hr />
            <button
              className="absolute right-2 top-0 p-2"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {query && (
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 p-2 text-center dark:bg-slate-300">
                    <User width={18} />{" "}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                    {query}
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="relative ml-2 flex h-5 w-5 animate-spin">
                  <Loader />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 p-2 text-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )}

              {completion && !error ? (
                <div className="flex flex-col items-start gap-4 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 p-2 text-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <div className="w-full">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw as any]}
                      className="prose dark:prose-invert max-w-full break-words [&_*]:break-words"
                      components={{
                        pre: ({ node, ...props }) => (
                          <pre {...props} className="whitespace-pre-wrap" />
                        ),
                        code: ({ node, ...props }) => (
                          <code {...props} className="whitespace-pre-wrap" />
                        ),
                      }}
                    >
                      {completion}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : null}

              <div className="relative">
                <Input
                  placeholder="Ask AI..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute right-5 top-3 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{" "}
                <ExampleQueryButton
                  exampleQuery="What is Wishocracy?"
                  setQuery={setQueryAndSubmit}
                />
                <ExampleQueryButton
                  exampleQuery="What is Wishonia?"
                  setQuery={setQueryAndSubmit}
                />
                <ExampleQueryButton
                  exampleQuery="What is Aggregated Pairwise Preference Allocation?"
                  setQuery={setQueryAndSubmit}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-red-500">
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}