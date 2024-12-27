import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/lib/auth"
import { prisma } from '@/lib/prisma'
import { getOrganizationRelationships } from '@/lib/queries/organizationQueries'

import OrganizationInfo from './OrganizationInfo'
import { OrganizationActions } from './components/OrganizationActions'
import { OrganizationEvents } from './components/OrganizationEvents'
import { OrganizationMembers } from './components/OrganizationMembers'
import { OrganizationPartnerships } from './components/OrganizationPartnerships'
import { OrganizationProducts } from './components/OrganizationProducts'


export default async function OrganizationPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const organization = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: {
      owner: true,
      organizationMemberships: {
        include: {
          person: true
        }
      },
      locations: true,
      followers: {
        include: {
          user: true
        }
      },
      Product: true,
      Service: true,
      Event: true,
      Partnership: true,
      globalProblems: {
        include: {
          globalProblem: true
        }
      },
      globalSolutions: {
        include: {
          globalSolution: true
        }
      },
      organizationSkills: {
        include: {
          skill: true
        }
      }
    }
  })

  if (!organization) {
    notFound()
  }

  const isOwner = session?.user?.id === organization.ownerId
  const isFollowing = organization.followers.some(f => f.userId === session?.user?.id)

  const relationships = await getOrganizationRelationships(organization.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{organization.name}</h1>
            {organization.tagline && (
              <p className="text-muted-foreground mt-2">{organization.tagline}</p>
            )}
          </div>
          <OrganizationActions 
            organization={organization} 
            isOwner={isOwner}
            isFollowing={isFollowing}
            userId={session?.user?.id}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="products">Products & Services</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="problems">Global Problems</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OrganizationInfo organization={organization} isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="members">
            <OrganizationMembers 
              members={organization.organizationMemberships}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="products">
            <OrganizationProducts 
              products={organization.Product}
              services={organization.Service}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="events">
            <OrganizationEvents 
              events={organization.Event}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="partnerships">
            <OrganizationPartnerships 
              partnerships={organization.Partnership}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="problems">
            <div className="grid gap-4">
              <h2 className="text-2xl font-bold">Global Problems</h2>
              {organization.globalProblems.map(problem => (
                <div key={problem.globalProblemId}>
                  <h3 className="text-xl font-semibold">{problem.globalProblem.name}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                  {problem.achievements && problem.achievements.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Key Achievements</h4>
                      <ul className="list-disc list-inside">
                        {problem.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
