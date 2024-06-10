'use client'

import * as React from 'react'
import {Button} from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog'
import {Input} from './ui/input'
import {useCompletion} from 'ai/react'
import {X, Loader, User, Frown, CornerDownLeft, Search, Wand, Sparkle} from 'lucide-react'
import ReactMarkdown from "react-markdown";
import {ExampleQueryButton} from "@/components/search-dialog/ui/ExampleQueryButton";
import rehypeRaw from "rehype-raw";

export function AskAISearchDialog() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState<string>('')

    const {complete, completion, isLoading, error} = useCompletion({
        api: '/api/vector-search',
    })

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && e.metaKey) {
                setOpen(true)
            }

            if (e.key === 'Escape') {
                console.log('esc')
                handleModalToggle()
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    function handleModalToggle() {
        setOpen(!open)
        setQuery('')
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
                className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] "
            >
                <Sparkle width={15}/>
                <span className="border border-l h-5"></span>
                <span className="inline-block ml-4">Ask AI...</span>
            </button>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[850px] max-h-[100vh] overflow-y-auto text-black">
                    <DialogHeader>
                        <DialogTitle>Talk to Wishonia</DialogTitle>
                        <DialogDescription>
                            Learn about how we can solve coordination problems and maximize universal wish fulfilment.
                        </DialogDescription>
                        <hr/>
                        <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
                            <X className="h-4 w-4 dark:text-gray-100"/>
                        </button>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4 text-slate-700">
                            {query && (
                                <div className="flex gap-4">
                  <span
                      className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18}/>{' '}
                  </span>
                                    <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
                                </div>
                            )}

                            {isLoading && (
                                <div className="animate-spin relative flex w-5 h-5 ml-2">
                                    <Loader/>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18}/>
                  </span>
                                    <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                                </div>
                            )}

                            {completion && !error ? (
                                <div className="flex flex-col items-start gap-4 dark:text-white">
  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
    <Wand width={18} className="text-white"/>
  </span>
                                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                        {completion}
                                    </ReactMarkdown>
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
                                    className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                                        query ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-100">
                                Or try:{' '}
                                <ExampleQueryButton exampleQuery="What is Wishocracy?" setQuery={setQueryAndSubmit}/>
                                <ExampleQueryButton exampleQuery="What is Wishonia?" setQuery={setQueryAndSubmit}/>
                                <ExampleQueryButton exampleQuery="What is Aggregated Pairwise Preference Allocation?"
                                                    setQuery={setQueryAndSubmit}/>
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
