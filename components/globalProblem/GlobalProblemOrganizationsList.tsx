"use client"

import { useState, useEffect } from "react"
import { GlobalProblem, FocusLevel, Organization } from "@prisma/client"
import { ExtendedUser } from "@/types/auth"
import { getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrganizationItem } from "@/components/organizations/OrganizationItem"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CreateOrganizationForm from "@/app/organizations/CreateOrganizationForm"
import type { GlobalProblemRelationships } from "@/lib/queries/globalProblemQueries"

interface GlobalProblemOrganizationsListProps {
  globalProblem: GlobalProblem
  user: ExtendedUser
  searchQuery?: string
}

type SortOption = "name" | "focusLevel" | "newest"

const FOCUS_LEVEL_WEIGHTS: Record<FocusLevel, number> = {
  PRIMARY: 3,
  HIGH: 2,
  MEDIUM: 1,
  LOW: 0
}

export function GlobalProblemOrganizationsList({ 
  globalProblem,
  user,
  searchQuery = ""
}: GlobalProblemOrganizationsListProps) {
  const [relationships, setRelationships] = useState<GlobalProblemRelationships | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const relData = await getGlobalProblemRelationshipsAction(globalProblem.id)
      setRelationships(relData)
    } catch (err) {
      console.error('Error loading organizations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [globalProblem.id])

  const filteredAndSortedOrganizations = relationships?.organizations
    .filter(org => 
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.industry?.toLowerCase().includes(search.toLowerCase()) ||
      org.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "focusLevel":
          const aWeight = a.focusLevel ? FOCUS_LEVEL_WEIGHTS[a.focusLevel] : -1
          const bWeight = b.focusLevel ? FOCUS_LEVEL_WEIGHTS[b.focusLevel] : -1
          return bWeight - aWeight
        default:
          return 0
      }
    })

  if (loading) {
    return <div>Loading organizations...</div>
  }

  if (!relationships?.organizations.length) {
    return <div>No organizations found.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="focusLevel">Focus Level</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Enter the URL of the organization you want to add.
              </DialogDescription>
            </DialogHeader>
            <CreateOrganizationForm 
              userId={user.id}
              onSuccess={() => {
                setIsDialogOpen(false)
                // Reload the organizations list
                loadData()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedOrganizations?.map((org) => (
            <OrganizationItem
              key={org.id}
              organization={org as Organization}
              showProblem={true}
              problemName={globalProblem.name}
            />
          ))}
        </div>
        
        {filteredAndSortedOrganizations?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No organizations found matching your search.
          </div>
        )}
      </ScrollArea>
    </div>
  )
} 