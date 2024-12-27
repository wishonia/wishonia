"use client"

import { Person } from "@prisma/client"
import { Search } from "lucide-react"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { PersonItem } from "./PersonItem"

interface PeopleListProps {
  people: Person[]
  roles?: Record<string, string>
  showRole?: boolean
}

export function PeopleList({ 
  people,
  roles,
  showRole = false
}: PeopleListProps) {
  const [search, setSearch] = useState("")

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(search.toLowerCase()) ||
    person.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
    person.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search people..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="grid gap-4 md:grid-cols-2">
          {filteredPeople.map((person) => (
            <PersonItem 
              key={person.id}
              person={person}
              role={roles?.[person.id]}
              showRole={showRole}
            />
          ))}
        </div>

        {filteredPeople.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No people found matching your search.
          </div>
        )}
      </ScrollArea>
    </div>
  )
} 