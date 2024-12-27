import { WishingWell } from "@prisma/client"

import { prisma as db, prisma } from "@/lib/db"
import { textCompletion } from "@/lib/llm"
import { convertKeysToCamelCase, toTitleCase } from "@/lib/stringHelpers"

export async function getRandomWishingWellPair(userId: string | undefined) {
  let randomPair: WishingWell[] = []
  if (userId) {
    // Get IDs of already allocated pairs
    const allocatedIds = await prisma.wishingWellPairAllocation.findMany({
      where: { userId },
      select: {
        thisWishingWellId: true,
        thatWishingWellId: true,
      },
    })
    
    // Create array of unique IDs without using Set
    const excludeIds = Array.from(
      new Set(
        allocatedIds.flatMap(a => [a.thisWishingWellId, a.thatWishingWellId])
      )
    )

    randomPair = await prisma.wishingWell.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      take: 2,
      orderBy: {
        // Use raw SQL random() for true randomness
        id: 'asc',
      },
    })

    // Shuffle the results in memory if we need true randomness
    randomPair.sort(() => Math.random() - 0.5)
  } else {
    randomPair = await prisma.wishingWell.findMany({
      take: 2,
      orderBy: {
        id: 'asc',
      },
    })
    
    // Shuffle the results in memory
    randomPair.sort(() => Math.random() - 0.5)
  }

  randomPair = randomPair.map(convertKeysToCamelCase)
  for (const problem of randomPair) {
    problem.name = toTitleCase(problem.name)
  }
  return randomPair
}

export async function generateAllWishingWellPairs() {
  const combinations: WishingWell[][] = []
  function generateCombinations(
    wishingWells: WishingWell[],
    currentCombination: WishingWell[] = []
  ) {
    if (wishingWells.length === 0) {
      combinations.push(currentCombination)
    } else {
      for (let i = 0; i < wishingWells.length; i++) {
        const newCombination = currentCombination.concat(wishingWells[i])
        const remainingWishingWells = wishingWells
          .slice(0, i)
          .concat(wishingWells.slice(i + 1))
        generateCombinations(remainingWishingWells, newCombination)
      }
    }
  }
  const wishingWells = await prisma.wishingWell.findMany()
  generateCombinations(wishingWells)
  return combinations
}

export async function aggregateWishingWellPairAllocations() {
  const allocations = await prisma.wishingWellPairAllocation.findMany()
  const allocationsByWishingWellId: Record<string, number> = {}
  // Sum up the percentages for each problem
  for (const allocation of allocations) {
    const { thisWishingWellId, thatWishingWellId, thisWishingWellPercentage } =
      allocation

    allocationsByWishingWellId[thisWishingWellId] =
      (allocationsByWishingWellId[thisWishingWellId] || 0) +
      thisWishingWellPercentage
    allocationsByWishingWellId[thatWishingWellId] =
      (allocationsByWishingWellId[thatWishingWellId] || 0) +
      (100 - thisWishingWellPercentage)
  }

  const totalAllocations = Object.values(allocationsByWishingWellId).reduce(
    (sum, allocation) => sum + allocation,
    0
  )

  // Normalize the allocations to ensure they add up to 100%
  const normalizedAllocations: Record<string, number> = {}
  for (const problemId in allocationsByWishingWellId) {
    normalizedAllocations[problemId] =
      (allocationsByWishingWellId[problemId] / totalAllocations) * 100
  }
  const results = []
  for (const wishingWellId in normalizedAllocations) {
    const result = await prisma.wishingWell.update({
      where: { id: wishingWellId },
      data: { averageAllocation: normalizedAllocations[wishingWellId] },
    })
    results.push(result)
  }
  return results
}

export async function wishToWishingWell(wish: string) {
  const str = await textCompletion(
    `Return a json object with the following properties of an article on this wish: 
      
      ${wish}
      
      Here are the Properties of the object you should return:
      1. "name": a generalized name for the wish of the under 64 characters long. Make it generalized and as short as possible so we can avoid duplicate wish entries.  Should not include the word Wish.
      2. "description": a meta description for the article under 240 characters long`,
    "json_object"
  )
  const obj = JSON.parse(str)
  //obj.content = textCompletion(generateArticlePrompt(wish), "text");
  //await generateAndUploadImageToVercel(obj);
  return obj
}

export async function saveWishToWishingWell(wish: string, userId: string) {
  const obj = await wishToWishingWell(wish)
  obj.userId = userId

  // Check if a wishingWell with the same name already exists
  const existingWishingWell = await db.wishingWell.findFirst({
    where: {
      name: obj.name,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  })

  // If it exists, return it
  if (existingWishingWell) {
    return existingWishingWell
  }

  // If it doesn't exist, create a new one
  return db.wishingWell.create({
    data: obj,
    select: {
      id: true,
      name: true,
      description: true,
    },
  })
}
export async function createMinimalWishingWellPairs(testUserId: string) {
  const wishingWells: WishingWell[] = await prisma.wishingWell.findMany()
  const pairs: [WishingWell, WishingWell][] = []

  for (let i = 0; i < wishingWells.length; i++) {
    const thisWishingWell = wishingWells[i]
    const thatWishingWell =
      i + 1 < wishingWells.length ? wishingWells[i + 1] : wishingWells[0]

    pairs.push([thisWishingWell, thatWishingWell])

    await prisma.wishingWellPairAllocation.create({
      data: {
        thisWishingWellId: thisWishingWell.id,
        thatWishingWellId: thatWishingWell.id,
        thisWishingWellPercentage: 50,
        userId: testUserId,
      },
    })
  }

  return pairs
}
export async function updateOrCreateWishingWellPairAllocation(
  thisWishingWellId: string,
  thatWishingWellId: string,
  thisWishingWellPercentage: number,
  userId: string
) {
  const result = await prisma.wishingWellPairAllocation.upsert({
    where: {
      userId_thisWishingWellId_thatWishingWellId: {
        userId: userId,
        thisWishingWellId: thisWishingWellId,
        thatWishingWellId: thatWishingWellId,
      },
    },
    update: {
      thisWishingWellPercentage,
    },
    create: {
      thisWishingWellId,
      thatWishingWellId,
      thisWishingWellPercentage,
      userId,
    },
  })
  await aggregateWishingWellPairAllocations()
  return result
}
