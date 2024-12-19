"use client"

import { useState, useEffect } from "react"
import { GlobalProblem } from "@prisma/client"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExtendedUser } from "@/types/auth"
import { getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"
import type { RelatedOrganization } from "@/lib/queries/globalProblemQueries"

interface GlobalProblemOrganizationsListProps {
  globalProblem: GlobalProblem
  user: ExtendedUser
  searchQuery?: string
}

export function GlobalProblemOrganizationsList({ 
  globalProblem,
  user,
  searchQuery = ""
}: GlobalProblemOrganizationsListProps) {
  const [organizations, setOrganizations] = useState<RelatedOrganization[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [filteredOrganizations, setFilteredOrganizations] = useState<RelatedOrganization[]>([])

  useEffect(() => {
    async function loadOrganizations() {
      try {
        setLoading(true)
        const relationships = await getGlobalProblemRelationshipsAction(globalProblem.id)
        setOrganizations(relationships.organizations)
        setFilteredOrganizations(relationships.organizations)
      } catch (error) {
        console.error("Failed to load organizations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [globalProblem.id])

  useEffect(() => {
    const filtered = organizations.filter(org => 
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.industry?.toLowerCase().includes(search.toLowerCase()) ||
      org.mission?.toLowerCase().includes(search.toLowerCase()) ||
      org.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredOrganizations(filtered)
  }, [search, organizations])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">
          Organizations Working on {globalProblem.name}
        </h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations by name, industry, or mission..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrganizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                  {org.industry && (
                    <CardDescription>{org.industry}</CardDescription>
                  )}
                </div>
                <Badge variant="secondary">
                  {org.focusLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {org.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {org.description}
                </p>
              )}
              <div className="space-y-1">
                {org.mission && (
                  <p className="text-sm">
                    <span className="font-semibold">Mission:</span> {org.mission}
                  </p>
                )}
                {org.headquartersLocation && (
                  <p className="text-sm">
                    <span className="font-semibold">HQ:</span> {org.headquartersLocation}
                  </p>
                )}
                {org.companySize && (
                  <p className="text-sm">
                    <span className="font-semibold">Size:</span> {org.companySize}
                  </p>
                )}
              </div>
              {org.achievements?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Key Achievements:</p>
                  <ul className="list-disc list-inside text-sm">
                    {org.achievements.map((achievement, i) => (
                      <li key={i} className="truncate">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center text-muted-foreground">
          No organizations found matching your search.
        </div>
      )}
    </div>
  )
} 