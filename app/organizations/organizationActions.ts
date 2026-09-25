"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/api/getUserIdServer";
import { getOrCreateOrganizationFromUrl } from "@/lib/agents/researcher/organizationAgent";
import { ClaimCheck, checkOrganizationClaim } from "@/lib/organizationClaim";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/session";

// The only fields the organization edit form changes.
type OrganizationUpdate = {
  name?: string
  description?: string | null
  email?: string | null
  telephone?: string | null
}

export async function updateOrganization(organizationId: string, data: OrganizationUpdate) {
  const userId = await requireUserId()
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { ownerId: true },
  })
  if (!organization) {
    throw new Error("Organization not found")
  }
  if (organization.ownerId !== userId && !(await isAdmin())) {
    throw new Error("Only the organization owner can edit it")
  }

  try {
    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        telephone: data.telephone,
      },
    })
    revalidatePath(`/organizations/${updatedOrg.slug}`)
    return updatedOrg
  } catch (error) {
    console.error("Error updating organization:", error)
    throw new Error("Failed to update organization")
  }
}

export async function getOrganization(organizationUrl: string) {
  const userId = await requireUserId()
  return await getOrCreateOrganizationFromUrl(organizationUrl, userId)
}

async function checkClaimForUser(organizationId: string, userId: string) {
  const [organization, user, admin] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { ownerId: true, url: true, slug: true },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, emailVerified: true, accounts: { select: { provider: true } } },
    }),
    isAdmin(),
  ])
  if (!organization || !user) {
    return { organization, check: { allowed: false, reason: "Organization not found." } as ClaimCheck }
  }
  const check = checkOrganizationClaim({
    ownerId: organization.ownerId,
    organizationUrl: organization.url,
    isAdmin: Boolean(admin),
    email: user.email,
    emailVerified: user.emailVerified,
    providers: user.accounts.map(({ provider }) => provider),
  })
  return { organization, check }
}

// Tells the organization page whether the signed-in user can claim it.
// Returns a result instead of throwing, because production builds hide the
// message of an error thrown by a server action.
export async function getOrganizationClaimCheck(organizationId: string): Promise<ClaimCheck> {
  const userId = await requireUserId()
  return (await checkClaimForUser(organizationId, userId)).check
}

export async function claimOrganization(organizationId: string): Promise<ClaimCheck> {
  const userId = await requireUserId()
  const { organization, check } = await checkClaimForUser(organizationId, userId)
  if (!organization || !check.allowed) return check

  // Set the owner only while there is none, so two claims at the same time
  // cannot both succeed.
  const { count } = await prisma.organization.updateMany({
    where: { id: organizationId, ownerId: null },
    data: { ownerId: userId },
  })
  if (count === 0) {
    return { allowed: false, reason: "This organization already has an owner." }
  }
  revalidatePath(`/organizations/${organization.slug}`)
  return { allowed: true }
}
