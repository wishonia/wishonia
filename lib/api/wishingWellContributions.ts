import { prisma as db } from "@/lib/db"
import { DateRange, WishingWellByDate, WishingWellEntry } from "@/types"


export async function getWishingWellContributions(
  id: string,
  dateRange: DateRange,
  type: "user" | "wishingWell"
) {
  const typeCondition =
    type === "wishingWell"
      ? { wishingWellId: id }
      : { wishingWell: { userId: id } }

  return db.wishingWellContribution.findMany({
    select: {
      id: true,
      date: true,
      count: true,
      wishingWell: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
      ...typeCondition,
    },
    orderBy: {
      date: "desc",
    },
  })
}

export async function getStreak(
  id: string,
  type: "user" | "wishingWell"
): Promise<{
  currentStreak: number
  longestStreak: number
}> {
  const typeCondition =
    type === "wishingWell"
      ? { wishingWellId: id }
      : { wishingWell: { userId: id } }

  const wishingWellContributions = await db.wishingWellContribution.findMany({
    where: typeCondition,
    distinct: "date",
    orderBy: { date: "asc" },
  })

  if (wishingWellContributions.length === 0) {
    return { longestStreak: 0, currentStreak: 0 }
  }

  let currentStreak = 1
  let longestStreak = 1

  const oneDay = 24 * 60 * 60 * 1000

  for (let i = 0; i < wishingWellContributions.length - 1; i++) {
    const latestDate = new Date(wishingWellContributions[i].date).getTime()
    const nextDate = new Date(wishingWellContributions[i + 1].date).getTime()

    const timeDiff = latestDate - nextDate

    if (Math.abs(timeDiff) <= oneDay) {
      currentStreak++
    } else {
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
      currentStreak = 1
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak
  }

  // Reset streak if user is inactive
  const lastContributionDate = new Date(
    wishingWellContributions[wishingWellContributions.length - 1].date
  ).getTime()
  const currentDate = new Date().getTime()
  const timeDiff = currentDate - lastContributionDate

  if (Math.abs(timeDiff) > oneDay * 2) {
    currentStreak = 0
  }

  return { longestStreak, currentStreak }
}

export async function getTotalWishingWellContributions(
  id: string,
  dateRange: DateRange,
  type: "user" | "wishingWell"
) {
  const typeCondition =
    type === "wishingWell"
      ? { wishingWellId: id }
      : { wishingWell: { userId: id } }

  const wishingWellContributions = await db.wishingWellContribution.findMany({
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
      ...typeCondition,
    },
    select: {
      count: true,
    },
  })

  if (wishingWellContributions.length === 0) {
    return 0
  }

  let totalCount = 0

  for (const contribution of wishingWellContributions) {
    totalCount += contribution.count
  }

  return totalCount
}

export async function getMostContributedWishingWell(
  userId: string,
  dateRange: DateRange
) {
  const wishingWellContributions = await db.wishingWellContribution.groupBy({
    by: ["wishingWellId"],
    _sum: {
      count: true,
    },
    orderBy: {
      _sum: {
        count: "desc",
      },
    },
    where: {
      wishingWell: {
        userId: userId,
      },
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
  })

  if (wishingWellContributions.length === 0) {
    return "N/A"
  }

  const mostContributedWishingWellId = wishingWellContributions[0].wishingWellId
  const mostContributedWishingWell = await db.wishingWell.findUnique({
    select: {
      name: true,
    },
    where: {
      id: mostContributedWishingWellId,
    },
  })

  return mostContributedWishingWell?.name
}

export async function getTopWishingWells(
  userId: string,
  dateRange: DateRange
): Promise<WishingWellEntry[]> {
  const wishingWellContributions = await db.wishingWellContribution.groupBy({
    by: ["wishingWellId"],
    _sum: {
      count: true,
    },
    orderBy: {
      _sum: {
        count: "desc",
      },
    },
    where: {
      wishingWell: {
        userId: userId,
      },
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
  })

  return await Promise.all(
    wishingWellContributions.slice(0, 10).map(async (contribution) => {
      const wishingWell = await db.wishingWell.findUnique({
        where: {
          id: contribution.wishingWellId,
        },
      })
      return {
        name: wishingWell?.name || "N/A",
        count: contribution._sum.count,
      }
    })
  )
}

export async function getWishingWellCountByDate(
  userId: string,
  dateRange: DateRange
): Promise<WishingWellByDate[]> {
  const wishingWellContributions = await db.wishingWellContribution.groupBy({
    by: ["date"],
    _sum: {
      count: true,
    },
    orderBy: {
      date: "asc",
    },
    where: {
      wishingWell: {
        userId: userId,
      },
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
  })

  const dateMap = new Map<string, number>()

  wishingWellContributions.forEach((contribution) => {
    dateMap.set(contribution.date.toISOString(), contribution._sum.count ?? 0)
  })

  let earliestNonZeroDate = null
  for (const contribution of wishingWellContributions) {
    if (contribution._sum.count !== 0) {
      earliestNonZeroDate = contribution.date
      break
    }
  }

  const result: WishingWellByDate[] = []

  if (earliestNonZeroDate) {
    const currentDate = new Date(earliestNonZeroDate)

    while (currentDate <= new Date(dateRange.to)) {
      const currentDateISOString = currentDate.toISOString()
      result.push({
        date: currentDateISOString,
        count: dateMap.get(currentDateISOString) ?? 0,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }
  }

  return result
}

export async function getDailyAverage(
  wishingWellId: string,
  dateRange: DateRange
): Promise<number> {
  const wishingWellContributions = await db.wishingWellContribution.findMany({
    where: {
      wishingWellId: wishingWellId,
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const totalCount = wishingWellContributions.reduce(
    (sum, contribution) => sum + contribution.count,
    0
  )

  if (totalCount === 0) {
    return 0
  }

  const oldestDate = new Date(wishingWellContributions[0].date)
  const today = new Date(dateRange.to.toISOString())
  const timePeriodInDays = Math.ceil(
    (today.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const dailyAverage = totalCount / timePeriodInDays

  if (Number.isInteger(dailyAverage)) {
    return dailyAverage
  } else {
    return parseFloat(dailyAverage.toFixed(2))
  }
}
