"use client"

import { useState, useEffect } from "react"
import { GlobalProblem } from "@prisma/client"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExtendedUser } from "@/types/auth"
import { getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"
import type { RelatedPerson } from "@/lib/queries/globalProblemQueries"

interface GlobalProblemPeopleListProps {
  globalProblem: GlobalProblem
  user: ExtendedUser
  searchQuery?: string
}

export function GlobalProblemPeopleList({ 
  globalProblem,
  user,
  searchQuery = ""
}: GlobalProblemPeopleListProps) {
  const [people, setPeople] = useState<RelatedPerson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [filteredPeople, setFilteredPeople] = useState<RelatedPerson[]>([])

  useEffect(() => {
    async function loadPeople() {
      try {
        setLoading(true)
        const relationships = await getGlobalProblemRelationshipsAction(globalProblem.id)
        setPeople(relationships.people)
        setFilteredPeople(relationships.people)
      } catch (error) {
        console.error("Failed to load people:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPeople()
  }, [globalProblem.id])

  useEffect(() => {
    const filtered = people.filter(person => 
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase()) ||
      person.company?.toLowerCase().includes(search.toLowerCase()) ||
      person.bio?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredPeople(filtered)
  }, [search, people])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          People Working on {globalProblem.name}
        </h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search people by name, role, or organization..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPeople.map((person) => (
          <Card key={person.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                {person.image && (
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{person.name}</CardTitle>
                  {person.jobTitle && (
                    <CardDescription>{person.jobTitle}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {person.bio && (
                <p className="text-sm text-muted-foreground mb-2">
                  {person.bio}
                </p>
              )}
              <div className="space-y-1">
                {person.company && (
                  <p className="text-sm">
                    <span className="font-semibold">Organization:</span> {person.company}
                  </p>
                )}
                {person.location && (
                  <p className="text-sm">
                    <span className="font-semibold">Location:</span> {person.location}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Role:</span> {person.role}
                </p>
              </div>
              <div className="mt-2 space-y-2">
                <Badge variant="secondary">
                  {person.expertise}
                </Badge>
                {person.publications?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold">Publications:</p>
                    <ul className="list-disc list-inside text-sm">
                      {person.publications.slice(0, 2).map((pub, i) => (
                        <li key={i} className="truncate">{pub}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="text-center text-muted-foreground">
          No people found matching your search.
        </div>
      )}
    </div>
  )
} 