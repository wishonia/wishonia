"use client"

import { useState, useEffect } from "react"
import { GlobalProblem, Prisma } from "@prisma/client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExtendedUser } from "@/types/auth"
import { getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"

type PersonWithRelations = Prisma.PersonGlobalProblemGetPayload<{
  include: { person: true }
}>

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
  const [people, setPeople] = useState<PersonWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [filteredPeople, setFilteredPeople] = useState<PersonWithRelations[]>([])

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
    const filtered = people.filter(personRelation => 
      personRelation.person.name.toLowerCase().includes(search.toLowerCase()) ||
      personRelation.role?.toLowerCase().includes(search.toLowerCase()) ||
      personRelation.person.company?.toLowerCase().includes(search.toLowerCase()) ||
      personRelation.person.bio?.toLowerCase().includes(search.toLowerCase())
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
        {filteredPeople.map((personRelation) => (
          <Card key={personRelation.person.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                {personRelation.person.image && (
                  <img 
                    src={personRelation.person.image} 
                    alt={personRelation.person.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{personRelation.person.name}</CardTitle>
                  {personRelation.person.jobTitle && (
                    <CardDescription>{personRelation.person.jobTitle}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {personRelation.person.bio && (
                <p className="text-sm text-muted-foreground mb-2">
                  {personRelation.person.bio}
                </p>
              )}
              <div className="space-y-1">
                {personRelation.person.company && (
                  <p className="text-sm">
                    <span className="font-semibold">Organization:</span> {personRelation.person.company}
                  </p>
                )}
                {personRelation.person.location && (
                  <p className="text-sm">
                    <span className="font-semibold">Location:</span> {personRelation.person.location}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-semibold">Role:</span> {personRelation.role || 'Unknown'}
                </p>
              </div>
              <div className="mt-2 space-y-2">
                <Badge variant="secondary">
                  {personRelation.expertise}
                </Badge>
                {personRelation.publications?.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold">Publications:</p>
                    <ul className="list-disc list-inside text-sm">
                      {personRelation.publications.slice(0, 2).map((publication: string, index: number) => (
                        <li key={index} className="truncate">{publication}</li>
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