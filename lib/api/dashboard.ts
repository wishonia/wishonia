import {
  getDailyAverage,
  getStreak,
  getTotalWishingWellContributions,
  getWishingWellContributions,
} from "@/lib/api/wishingWellContributions"

type DateRangeType = {
  from: Date
  to: Date
}

export async function getStatsDashboardData(
  wishingWellId: string,
  dateRange: DateRangeType
) {
  const [
    wishingWellContributions,
    streak,
    totalWishingWellContributions,
    dailyAverage,
  ] = await Promise.all([
    getWishingWellContributions(wishingWellId, dateRange, "wishingWell"),
    getStreak(wishingWellId, "wishingWell"),
    getTotalWishingWellContributions(wishingWellId, dateRange, "wishingWell"),
    getDailyAverage(wishingWellId, dateRange),
  ])

  return {
    wishingWellContributions,
    streak,
    totalWishingWellContributions,
    dailyAverage,
  }
}
