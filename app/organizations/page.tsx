import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CreateOrganizationForm from './CreateOrganizationForm'
import { Organization } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"

async function getOrganizations(search: string = '') {
  return prisma.organization.findMany({
      where: {
          OR: [
              {name: {contains: search, mode: 'insensitive'}},
              {description: {contains: search, mode: 'insensitive'}},
          ],
      },
      orderBy: {name: 'asc'},
  });
}

async function OrganizationsList({ search }: { search: string }) {
  const organizations = await getOrganizations(search)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org: Organization) => (
        <Card key={org.id}>
          <CardHeader>
            <CardTitle>{org.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{org.description}</p>
            <Link href={`/organizations/${org.slug}`}>
              <Button>View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams: { search: string }
}) {
  const search = searchParams.search || ''
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id || ''

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Organizations</h1>
      
      <div className="mb-8">
        <form>
          <Input
            type="text"
            name="search"
            placeholder="Search organizations..."
            defaultValue={search}
            className="w-full max-w-md"
          />
        </form>
      </div>

      <Suspense fallback={<div>Loading organizations...</div>}>
        <OrganizationsList search={search} />
      </Suspense>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Create New Organization</h2>
        <CreateOrganizationForm userId={userId} />
      </div>
    </div>
  )
}
