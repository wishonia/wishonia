"use client"

import { Icons } from "@/components/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { SearchParams } from "@/types"


interface StatsCardsProps {
  data: {
    streak: {
      currentStreak: number
      longestStreak: number
    }
    totalWishingWellContributions: number
    dailyAverage: number
  }
  searchParams: SearchParams
}

function displayDateRange(searchParams: SearchParams) {
  return (
    <>
      {searchParams.from && searchParams.to
        ? `${formatDate(
            new Date(searchParams.from).toISOString()
          )} - ${formatDate(new Date(searchParams.to).toISOString())}`
        : "Last year"}
    </>
  )
}

export function StatsCards({ data, searchParams }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Icons.fire className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.streak.currentStreak}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <Icons.fire className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.streak.longestStreak}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Wishing Well Contributions
          </CardTitle>
          <Icons.history className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalWishingWellContributions}
          </div>
          <p className="text-xs text-muted-foreground">
            {displayDateRange(searchParams)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <Icons.statsBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.dailyAverage}</div>
          <p className="text-xs text-muted-foreground">
            {displayDateRange(searchParams)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
