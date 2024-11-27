"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Measurement } from "@/types/models/Measurement"

export const measurementColumns: ColumnDef<Measurement>[] = [
  {
    accessorKey: "startAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startAt"))
      return (
        <div className="min-w-[100px]">
          {format(date, "MMM d, yyyy")}
          <div className="text-xs text-muted-foreground md:hidden">
            {format(date, "h:mm a")}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="min-w-[80px]">{row.getValue("value")}</div>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate md:max-w-none">
        {row.getValue("note")}
      </div>
    ),
  },
]