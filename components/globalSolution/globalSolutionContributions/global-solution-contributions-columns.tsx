"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { GlobalSolutionContributionsDeleteButton } from "./global-solution-contributions-delete-button"

export type GlobalSolutionContributionsType = {
  id: string
  date: Date
  count: number
  globalSolution: {
    id: string
    name: string
  }
}

export const globalSolutionContributionsColumns: ColumnDef<GlobalSolutionContributionsType>[] =
  [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        const date = new Date(row.getValue() as string)
        const formattedDate = Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(date)
        return <div className="min-w-[5rem] md:px-4">{formattedDate}</div>
      },
    },
    {
      accessorKey: "globalSolution",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            GlobalSolution
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        const globalSolution = row.row.original.globalSolution
        const name = globalSolution.name
        const id = globalSolution.id

        return (
          <Link
            href={`/dashboard/globalSolutions/${id}`}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            {name}
          </Link>
        )
      },
    },
    {
      accessorKey: "count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Count
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.original.count
        return <div className="px-4">{value}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const globalSolutionContributions = row.original
        return (
          <GlobalSolutionContributionsDeleteButton
            globalSolutionContributions={globalSolutionContributions}
          />
        )
      },
    },
  ]
