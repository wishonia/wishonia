'use server'

import { prisma } from "@/lib/db"

export async function getGlobalSolution(id: string) {
  try {
    const solution = await prisma.globalSolution.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        content: true,
        featuredImage: true,
        createdAt: true,
        updatedAt: true,
        averageAllocation: true,
      },
    })
    return solution
  } catch (error) {
    console.error('Error fetching global solution:', error)
    return null
  }
} 