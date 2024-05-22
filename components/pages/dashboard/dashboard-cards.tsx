"use client"

import { SearchParams } from "@/types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import {ToolCard} from "@/components/tool-card";

interface DashboardCardsProps {
  searchParams: SearchParams
}

export function DashboardCards({ searchParams }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ToolCard src={'img/wish-allocation.png'}
                href={'/wishingWells'}
                title={'Prioritize Wishes'}
                description={'Drag a  aggregated pairwise preference allocation'} />
      <ToolCard src={'img/wish-allocation-list.png'}
                href={'/wishingWells/results'}
                title={'Social Wish Allocations'}
                description={'See the amount of available resources the average person would allocate to the fulfillment of each wish'} />
    </div>
  )
}
