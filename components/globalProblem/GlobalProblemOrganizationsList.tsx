"use client"

import { GlobalProblem, Prisma, FocusLevel } from "@prisma/client"
import { Search, Plus } from "lucide-react"
import { useState, useEffect } from "react"

import { getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"
import CreateOrganizationForm from "@/app/organizations/CreateOrganizationForm"
import { OrganizationItem } from "@/components/organizations/OrganizationItem"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExtendedUser } from "@/types/auth"

type OrganizationWithRelations = Prisma.OrganizationGlobalProblemGetPayload<{
  include: { organization: true }
}>

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
  const [relationships, setRelationships] = useState<OrganizationWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const relData = await getGlobalProblemRelationshipsAction(globalProblem.id)
      setRelationships(relData.organizations)
    } catch (err) {
      console.error('Error loading organizations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [globalProblem.id])

  const filteredAndSortedOrganizations = relationships
    .filter(orgRelation => 
      orgRelation.organization.name.toLowerCase().includes(search.toLowerCase()) ||
      orgRelation.organization.industry?.toLowerCase().includes(search.toLowerCase()) ||
      orgRelation.organization.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.organization.name.localeCompare(b.organization.name)
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

  if (!relationships.length) {
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
                loadData()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedOrganizations.map((orgRelation) => (
            <OrganizationItem
              key={orgRelation.organization.id}
              organization={orgRelation.organization}
              showProblem={true}
              problemName={globalProblem.name}
            />
          ))}
        </div>
        
        {filteredAndSortedOrganizations.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No organizations found matching your search.
          </div>
        )}
      </ScrollArea>
    </div>
  )
} 