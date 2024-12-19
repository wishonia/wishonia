"use client"

import React, { useEffect, useState } from "react"
import { GlobalProblem } from "@prisma/client"
import { User } from "next-auth"

import { DataTable } from "@/components/data-table"
import { SpinningLoader } from "@/components/spinningLoader"
import {ColumnDef} from "@tanstack/react-table";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Link from "next/link";
import {cn} from "@/lib/utils";
import Image from "next/image";
import CoolGlobalProblemsPieChart from "@/components/global-problems-pie-chart";
import { GlobalProblemNavigationButton } from "@/components/globalProblem/GlobalProblemNavigationButton"

interface PollProps {
  user?: User
}

export const globalProblemColumns: ColumnDef<GlobalProblem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
          <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Problem
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
      )
    },
    cell: (row) => {
      const name = row.row.original.name
      const id = row.row.original.id
      const featuredImage = row.row.original.featuredImage || ""
      const description = row.row.original.description
      return (
          <Link
              href={`/globalProblems/${id}`}
              className={cn(buttonVariants({ variant: "ghost" }))}
              title={description || ""}
          >
            <Image
                src={featuredImage}
                className={"rounded-full object-cover p-2"}
                alt="Global Problem"
                width={50}
                height={50}
            />
            {name}
          </Link>
      )
    },
  },
  {
    accessorKey: "averageAllocation",
    header: ({ column }) => {
      return (
          <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Average Allocation
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
      )
    },
    cell: (row) => {
      let averageAllocation = row.getValue() as number
      if (!averageAllocation) {
        return (
            <Button
                variant="ghost"
                onClick={() => (window.location.href = `/globalSolutions`)}
            >
              Vote to See Results
              <Icons.lightbulb className="ml-2 h-4 w-4" />
            </Button>
        )
      }
      averageAllocation = parseFloat(averageAllocation.toFixed(1))
      return (
          <div className="min-w-[5rem] text-center md:px-4">
            {averageAllocation}%
          </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const globalProblem = row.original
      return (
        <div className="flex items-center gap-2">
          <GlobalProblemNavigationButton 
            globalProblem={globalProblem}
            variant="ghost"
            showNavigateText={false}
          />
        </div>
      )
    },
  },
]


export const GlobalProblemsList: React.FC<PollProps> = ({ user }) => {
  const [globalProblems, setGlobalProblems] = useState<GlobalProblem[]>([])
  const [loading, setLoading] = useState(false)
  const fetchGlobalProblems = async () => {
    setLoading(true)
    const response = await fetch("/api/globalProblems")
    const data = await response.json()
    setGlobalProblems(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchGlobalProblems()
    }
  }, [])

  if (!globalProblems || loading || globalProblems.length === 0) {
    return <SpinningLoader />
  }

  return (
    <>
      <CoolGlobalProblemsPieChart entries={globalProblems}></CoolGlobalProblemsPieChart>
      <DataTable
        columns={globalProblemColumns}
        data={globalProblems}
      ></DataTable>
    </>
  )
}
