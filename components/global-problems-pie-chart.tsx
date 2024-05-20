"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"
import {GlobalProblem} from "@prisma/client";

interface PieChartProps {
  data: GlobalProblem[]
}

export function GlobalProblemsPieChart({ data }: PieChartProps) {
  return (
    <Card className="grid grid-cols-1 p-2 md:grid-cols-2">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            stroke="black"
            strokeWidth={1}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={"white"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(count, name, entry) => [
              entry.payload.averageAllocation,
              entry.payload.name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center">
        <div className="p-4">
          {data.map((entry, index) => (
            <div
              key={`label-${index}`}
              className="mb-2 flex items-center text-sm"
            >
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
