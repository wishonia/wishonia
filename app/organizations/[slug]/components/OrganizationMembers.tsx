"use client"

import { Prisma } from "@prisma/client"

import { PeopleList } from "@/components/people/PeopleList"
import { Button } from "@/components/ui/button"

type OrganizationMembershipWithPerson = Prisma.OrganizationMembershipGetPayload<{
  include: { person: true }
}>

interface OrganizationMembersProps {
  members: OrganizationMembershipWithPerson[]
  isOwner: boolean
}

export function OrganizationMembers({ members, isOwner }: OrganizationMembersProps) {
  const people = members.map(m => m.person)
  const roles = members.reduce((acc, m) => ({
    ...acc,
    [m.personId]: m.role || ''
  }), {} as Record<string, string>)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Members</h2>
        {isOwner && (
          <Button variant="outline">
            Invite Member
          </Button>
        )}
      </div>
      
      <PeopleList 
        people={people}
        roles={roles}
        showRole={true}
      />
    </div>
  )
} 