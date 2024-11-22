"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export default function RatedTreatmentsSearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    params.set("page", "1")
    startTransition(() => {
      router.push(`/dfda/treatments?${params.toString()}`)
    })
  }, 300)

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("search")
    params.set("page", "1")
    startTransition(() => {
      router.push(`/dfda/treatments?${params.toString()}`)
    })
  }

  const currentSearch = searchParams.get("search")?.toString()

  return (
    <div className="relative w-full sm:w-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-gray-500" />
        <input
          type="search"
          placeholder="Search by name, condition, or side effect..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="
                        w-full border-4 border-black bg-white py-3
                        pl-12
                        pr-10 text-lg
                        font-bold
                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow
                        duration-200 placeholder:text-gray-500
                        focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                        focus:outline-none
                        sm:w-[400px]
                    "
        />
        {currentSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-4 transition-opacity hover:opacity-70"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
        </div>
      )}
    </div>
  )
}
