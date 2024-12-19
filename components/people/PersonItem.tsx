import { Person } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface PersonItemProps {
  person: Person
  role?: string
  showRole?: boolean
}

export function PersonItem({ person, role, showRole = false }: PersonItemProps) {
  return (
    <Link href={`/people/${person.id}`}>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-12 w-12 relative">
              {person.image ? (
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl text-gray-500">
                    {person.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{person.name}</CardTitle>
              {person.jobTitle && (
                <CardDescription>{person.jobTitle}</CardDescription>
              )}
              {showRole && role && (
                <CardDescription className="text-primary">{role}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {person.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {person.bio}
            </p>
          )}
          <div className="mt-2 space-y-1 text-sm">
            {person.location && (
              <p className="text-muted-foreground">
                📍 {person.location}
              </p>
            )}
            {person.company && (
              <p className="text-muted-foreground">
                🏢 {person.company}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 