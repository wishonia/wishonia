"use client"

import { Partnership } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrganizationPartnershipsProps {
  partnerships: Partnership[]
  isOwner: boolean
}

export function OrganizationPartnerships({ partnerships, isOwner }: OrganizationPartnershipsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Partnerships</h2>
        {isOwner && (
          <Button>Add Partnership</Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {partnerships.map((partnership) => (
          <Card key={partnership.id}>
            <CardHeader>
              <CardTitle>{partnership.partnerName}</CardTitle>
            </CardHeader>
            <CardContent>
              {partnership.description && (
                <p className="text-muted-foreground">{partnership.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 