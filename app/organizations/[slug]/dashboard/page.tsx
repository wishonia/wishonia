import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'


export default async function OrganizationDashboard({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const organization = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: { owner: true }
  })

  if (!organization) {
    notFound()
  }

  const isOwner = session?.user?.id === organization.ownerId

  if (!isOwner) {
    return <div>You do not have permission to view this dashboard.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{organization.name} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href={`/organizations/${organization.url}/edit`}>
              <a className="block p-2 bg-blue-100 hover:bg-blue-200 rounded">Edit Organization Info</a>
            </Link>
            <Link href={`/organizations/${organization.url}/proposals/new`}>
              <a className="block p-2 bg-green-100 hover:bg-green-200 rounded">Create New Proposal</a>
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Organization Stats</h2>
          {/* Add organization statistics here */}
        </div>
      </div>
    </div>
  )
}
