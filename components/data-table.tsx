"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  children?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
      <div className="w-full">
          <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                          <th
                              key={header.id}
                              className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                              {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                  )}
                          </th>
                      ))}
                  </tr>
              ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                          <td
                              key={cell.id}
                              className="whitespace-nowrap px-4 py-3 text-sm"
                          >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                      ))}
                  </tr>
              ))}
              </tbody>
          </table>
    </div>
  )
}
