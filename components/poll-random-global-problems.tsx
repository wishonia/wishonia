"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "next-auth"

import { getRandomGlobalProblemPairAction } from "@/app/actions/getRandomGlobalProblemPair"
import { PollSpecificGlobalProblems } from "@/components/poll-specific-global-problems"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  user?: User
}

export const PollRandomGlobalProblems: React.FC<PollProps> = ({ user }) => {
  const [globalProblems, setGlobalProblems] = useState<{
    thisGlobalProblem?: any
    thatGlobalProblem?: any
  }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const fetchGlobalProblems = async () => {
    setLoading(true)
    const data = await getRandomGlobalProblemPairAction()
    if (!data) {
      router.push("/globalProblems/results")
      return
    }
    setGlobalProblems(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchGlobalProblems()
    }
  }, [])

  if (
    loading ||
    !globalProblems.thisGlobalProblem ||
    !globalProblems.thatGlobalProblem
  ) {
    return <SpinningLoader />
  }

  return (
    <PollSpecificGlobalProblems
      thisGlobalProblem={globalProblems.thisGlobalProblem}
      thatGlobalProblem={globalProblems.thatGlobalProblem}
      updatePair={fetchGlobalProblems}
      user={user}
    />
  )
}
