"use client"

import { FC, useEffect, useState } from "react"

import { GenericVariableList } from "@/components/genericVariables/generic-variable-list"

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
  const [debouncedSearchPhrase, setDebouncedSearchPhrase] =
    useState(searchPhrase)

  // Define search parameters
  const searchParams = {
    includePublic: includePublic,
    sort: sort,
    limit: 10,
    offset: 0,
    searchPhrase: debouncedSearchPhrase, // Use debounced value
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log(`New search made: ${searchPhrase}`)
      setDebouncedSearchPhrase(searchPhrase)
    }, 500) // Delay of 500ms

    return () => clearTimeout(handler)
  }, [searchPhrase])

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
