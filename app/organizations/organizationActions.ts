"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/api/getUserIdServer";
import { getOrCreateOrganizationFromUrl } from "@/lib/agents/researcher/organizationAgent";
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
    revalidatePath(`/organizations/${updatedOrg.url}`)
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
