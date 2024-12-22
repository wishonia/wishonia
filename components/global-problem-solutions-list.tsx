"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GlobalProblemSolution } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { ExtendedUser } from "@/types/auth"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Icons } from "@/components/icons"
import { SpinningLoader } from "@/components/spinningLoader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PollProps {
  globalProblemId: string
  user?: ExtendedUser
}

export const GlobalProblemSolutionsList: React.FC<PollProps> = ({
  globalProblemId,
  user,
}) => {
  const [globalProblemSolutions, setGlobalProblemSolutions] = useState<
    GlobalProblemSolution[]
  >([])
  const [loading, setLoading] = useState(false)
  const fetchGlobalProblemSolutions = async (globalProblemId: string) => {
    setLoading(true)
    const response = await fetch(
      "/api/globalProblems/" + globalProblemId + "/solutions"
    )
    const data = await response.json()
    setGlobalProblemSolutions(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchGlobalProblemSolutions(globalProblemId)
  }, [globalProblemId])

  if (loading) {
    return <SpinningLoader />
  }
  const globalProblemSolutionColumns: ColumnDef<GlobalProblemSolution>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Solution
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: (row) => {
        let name = row.row.original.name
        const matches = name.match(/How (.*) Solves/)
        if (matches) {
          name = matches[1]
        }
        const id = row.row.original.id
        const featuredImage = row.row.original.featuredImage || ""
        const description = row.row.original.description
        const globalProblemId = row.row.original.globalProblemId
        const globalSolutionId = row.row.original.globalSolutionId
        return (
          <Link
            href={`/globalProblems/${globalProblemId}/solutions/${globalSolutionId}`}
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
              onClick={() =>
                (window.location.href = `/globalProblems/${globalProblemId}/vote`)
              }
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
      accessorKey: "globalSolutionId",
      header: "Actions",
      cell: ({ getValue }) => {
        const globalSolutionId = getValue() as string
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Icons.ellipsis className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/globalSolutions/${globalSolutionId}`}>
                  💡
                  View Solution Overview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/globalSolutions/${globalSolutionId}/tasks`}>
                  ✅
                  Decompose into Atomic Tasks
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/globalSolutions/${globalSolutionId}/globalProblems`}>
                  ⚠️
                  View Problems it Solves
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  if (user && user.admin) {
    globalProblemSolutionColumns.push({
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }) => {
        const itemId = row.original.id
        return (
          <div className="flex items-center justify-center">
            <Link href={`/globalProblemSolutions/${itemId}/edit`}>
              <Button variant="ghost" className="mr-2">
                <Icons.edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={async () => {
                await fetch(`/api/globalProblemSolutions/${itemId}`, {
                  method: "DELETE",
                })
                fetchGlobalProblemSolutions(globalProblemId)
              }}
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    })
  }

  return (
    <>
      {/*<GlobalProblemSolutionsPieChart data={globalProblemSolutions}></GlobalProblemSolutionsPieChart>*/}
      <DataTable
        columns={globalProblemSolutionColumns}
        data={globalProblemSolutions}
      ></DataTable>
    </>
  )
}
