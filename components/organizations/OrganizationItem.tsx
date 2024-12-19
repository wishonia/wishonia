"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Organization } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import { FocusLevel } from "@prisma/client"
import { getFaviconUrl } from "@/lib/utils/favicon"

interface OrganizationItemProps {
  organization: Organization & {
    focusLevel?: FocusLevel
    achievements?: string[]
  }
  showProblem?: boolean
  problemName?: string
}

export function OrganizationItem({ 
  organization, 
  showProblem = false,
  problemName
}: OrganizationItemProps) {
  const faviconUrl = getFaviconUrl(organization.url)

  return (
    <Link href={`/organizations/${organization.slug || ''}`}>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 relative">
              {(organization.logo || faviconUrl) ? (
                <Image
                  src={organization.logo || faviconUrl || ''}
                  alt={organization.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {organization.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{organization.name}</CardTitle>
                  {organization.industry && (
                    <CardDescription>{organization.industry}</CardDescription>
                  )}
                </div>
                {organization.focusLevel && (
                  <Badge variant="secondary">
                    {organization.focusLevel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {organization.description && (
            <p className="text-sm text-muted-foreground mb-2">
              {organization.description}
            </p>
          )}
          <div className="space-y-1">
            {organization.mission && (
              <p className="text-sm">
                <span className="font-semibold">Mission:</span> {organization.mission}
              </p>
            )}
            {organization.headquartersLocation && (
              <p className="text-sm">
                <span className="font-semibold">HQ:</span> {organization.headquartersLocation}
              </p>
            )}
            {organization.companySize && (
              <p className="text-sm">
                <span className="font-semibold">Size:</span> {organization.companySize}
              </p>
            )}
            {showProblem && problemName && (
              <p className="text-sm">
                <span className="font-semibold">Working on:</span> {problemName}
              </p>
            )}
          </div>
          {organization.achievements && organization.achievements.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-semibold">Key Achievements:</p>
              <ul className="list-disc list-inside text-sm">
                {organization.achievements.slice(0, 2).map((achievement, i) => (
                  <li key={i} className="truncate">{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
} 