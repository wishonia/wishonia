"use client"

import React, { useEffect, useState } from "react"
import { GlobalTask } from "@prisma/client"

import { DataTable } from "@/components/data-table"
import { SpinningLoader } from "@/components/spinningLoader"
import {ColumnDef} from "@tanstack/react-table";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Link from "next/link";
import {cn} from "@/lib/utils";
import Image from "next/image";

interface GlobalTasksListProps {
  globalSolutionId: string
}

const globalTaskColumns: ColumnDef<GlobalTask>[] = [
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
              href={`/globalTasks/${id}`}
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
]


export const GlobalTasksList: React.FC<GlobalTasksListProps> = ({ globalSolutionId }) => {
  const [globalTasks, setGlobalTasks] = useState<GlobalTask[]>([])
  const [loading, setLoading] = useState(false)
  const fetchGlobalTasks = async () => {
    setLoading(true)
    const response = await fetch("/api/globalSolutions/" + globalSolutionId + "/tasks")
    const data = await response.json()
    setGlobalTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchGlobalTasks()
    }
  }, [])

  if (loading || !globalTasks || globalTasks.length === 0) {
    return <SpinningLoader />
  }

  return (
    <>
      {/*<GlobalTasksPieChart data={globalTasks}></GlobalTasksPieChart>*/}
      <DataTable
        columns={globalTaskColumns}
        data={globalTasks}
      ></DataTable>
    </>
  )
}
