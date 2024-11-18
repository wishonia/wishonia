"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { Measurement } from "@/types/models/Measurement"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { MeasurementDeleteButton } from "./measurement-delete-button"

export const measurementColumns: ColumnDef<Measurement>[] = [
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
      const date = new Date(row.row.original.startAt)
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
    accessorKey: "userVariable",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Variable
          <Icons.sort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: (measurement) => {
      const variableName = measurement.row.original.variableName
      const variableId = measurement.row.original.variableId

      return (
        <Link
          href={`/dfda/userVariables/${variableId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          {variableName}
        </Link>
      )
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <Icons.sort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.original.value
      return <div className="px-4">{value}</div>
    },
  },
  {
    accessorKey: "unitAbbreviatedName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit
          <Icons.sort className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="px-4">{row.original.unitAbbreviatedName}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const measurement = row.original
      return <MeasurementDeleteButton measurement={measurement} />
    },
  },
]
