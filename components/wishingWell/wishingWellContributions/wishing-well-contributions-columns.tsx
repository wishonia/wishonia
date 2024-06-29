"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { WishingWellContributionsDeleteButton } from "./wishing-well-contributions-delete-button"

export type WishingWellContributionsType = {
  id: string
  date: Date
  count: number
  wishingWell: {
    id: string
    name: string
  }
}

export const wishingWellContributionsColumns: ColumnDef<WishingWellContributionsType>[] =
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
      accessorKey: "wishingWell",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            WishingWell
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        const wishingWell = row.row.original.wishingWell
        const name = wishingWell.name
        const id = wishingWell.id

        return (
          <Link
            href={`/dashboard/wishingWells/${id}`}
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
        const wishingWellContributions = row.original
        return (
          <WishingWellContributionsDeleteButton
            wishingWellContributions={wishingWellContributions}
          />
        )
      },
    },
  ]
