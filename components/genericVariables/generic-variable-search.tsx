"use client"

import { FC, useState, useMemo } from "react"

import { GenericVariableList } from "@/components/genericVariables/generic-variable-list"
import { useDebounce } from "@/lib/hooks/useDebounce"

type GenericVariableSearchProps = {
  user: {
    id: string
  }
  includePublic?: boolean // Optional parameter with a default value
  sort?: string // Optional parameter with a default value
}

export const GenericVariableSearch: FC<GenericVariableSearchProps> = ({
  user,
  includePublic = true,
  sort = "-numberOfUserVariables",
}) => {
  // State to manage search phrase
  const [searchPhrase, setSearchPhrase] = useState("")
  const debouncedSearchPhrase = useDebounce(searchPhrase, 500)

  // Memoize search parameters to prevent unnecessary re-renders
  const searchParams = useMemo(
    () => ({
      includePublic,
      sort,
      limit: 10,
      offset: 0,
      searchPhrase: debouncedSearchPhrase,
    }),
    [includePublic, sort, debouncedSearchPhrase]
  )

  return (
    <div className="search-container flex flex-col">
      {" "}
      {/* Added flex container */}
      <div className="mb-4">
        <input
          type="text"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
          placeholder="Search variables..."
          className="input-class form-control m-0 block w-full rounded-full border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        />
      </div>
      <GenericVariableList user={user} searchParams={searchParams} />
    </div>
  )
}
