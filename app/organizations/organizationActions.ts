"use server";

import { revalidatePath } from "next/cache";



import { getOrCreateOrganizationFromUrl } from "@/lib/agents/researcher/organizationAgent";
import { prisma } from "@/lib/prisma";





export async function updateOrganization(organizationId: string, data: any) {
  try {
    const updatedOrg = await prisma.organization.update({
      where: { id: organizationId },
      data,
    })
    revalidatePath(`/organizations/${updatedOrg.url}`)
    return updatedOrg
  } catch (error) {
    console.error("Error updating organization:", error)
    throw new Error("Failed to update organization")
  }
}

export async function getOrganization(organizationUrl: string, userId: string) {
  return await getOrCreateOrganizationFromUrl(organizationUrl, userId)
}