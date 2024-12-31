"use server"

import { WishingWell } from "@prisma/client"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { prisma } from "@/lib/db"
import { convertKeysToCamelCase } from "@/lib/stringHelpers"

export async function getRandomWishingWellPair() {
  try {
    const userId = await getUserIdServer()
    let randomPair: WishingWell[] = []
    
    if (userId) {
      randomPair = await prisma.$queryRaw`
          SELECT 
            id, name, description, content, images, "featuredImage",
            "createdAt", "updatedAt", "userId", "averageAllocation"
          FROM "WishingWell"
          WHERE id NOT IN (
            SELECT "thisWishingWellId" FROM "WishingWellPairAllocation" WHERE "userId" = ${userId}
            UNION
            SELECT "thatWishingWellId" FROM "WishingWellPairAllocation" WHERE "userId" = ${userId}
          )
          ORDER BY random()
          LIMIT 2;
        `
    } else {
      randomPair = await prisma.$queryRaw`
          SELECT 
            id, name, description, content, images, "featuredImage",
            "createdAt", "updatedAt", "userId", "averageAllocation"
          FROM "WishingWell"
          ORDER BY random()
          LIMIT 2;
        `
    }
    
    // Convert keys to camelCase
    randomPair = randomPair.map(convertKeysToCamelCase)

    return {
      thisWishingWell: randomPair[0],
      thatWishingWell: randomPair[1],
    }
  } catch (error) {
    console.error("Error fetching random wishing well pair:", error)
    throw error
  }
} 