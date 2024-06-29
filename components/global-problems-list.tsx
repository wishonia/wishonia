"use client"

import React, { useEffect, useState } from "react"
import { GlobalProblem } from "@prisma/client"
import { User } from "next-auth"

import { DataTable } from "@/components/data-table"
import { globalProblemColumns } from "@/components/global-problem-columns"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  user?: User
}

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
      {/*<GlobalProblemsPieChart data={globalProblems}></GlobalProblemsPieChart>*/}
      <DataTable
        columns={globalProblemColumns}
        data={globalProblems}
      ></DataTable>
    </>
  )
}
