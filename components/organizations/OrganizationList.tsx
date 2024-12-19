"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OrganizationItem } from "./OrganizationItem"
import type { RelatedOrganization } from "@/lib/queries/globalProblemQueries"

interface OrganizationListProps {
  organizations: RelatedOrganization[]
  showProblem?: boolean
  problemName?: string
  loading?: boolean
}

export function OrganizationList({
  organizations,
  showProblem = false,
  problemName,
  loading = false
}: OrganizationListProps) {
  const [search, setSearch] = useState("")
  const [filteredOrganizations, setFilteredOrganizations] = useState<RelatedOrganization[]>(organizations)

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
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search organizations by name, industry, or mission..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredOrganizations.map((org) => (
          <OrganizationItem 
            key={org.id}
            organization={org}
            showProblem={showProblem}
            problemName={problemName}
          />
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