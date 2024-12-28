"use client"

import { GlobalProblem } from "@prisma/client"
import { Search } from "lucide-react"
import { User } from "next-auth"
import React, { useEffect, useState } from "react"

import CoolGlobalProblemsPieChart from "@/components/global-problems-pie-chart"
import { GlobalProblemListItem } from "@/components/globalProblem/GlobalProblemListItem"
import { SpinningLoader } from "@/components/spinningLoader"
import { Input } from "@/components/ui/input"

interface PollProps {
  user?: User
}

export const GlobalProblemsList: React.FC<PollProps> = ({ user }) => {
  const [globalProblems, setGlobalProblems] = useState<GlobalProblem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
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

  const filteredProblems = globalProblems.filter((problem) =>
    problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (problem.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )

  if (!globalProblems || loading || globalProblems.length === 0) {
    return <SpinningLoader />
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden">
      <div className="w-full max-w-sm">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-4 w-full">
        {filteredProblems.map((problem) => (
          <GlobalProblemListItem key={problem.id} problem={problem} />
        ))}
      </div>
      <CoolGlobalProblemsPieChart entries={globalProblems} />
    </div>
  )
}
