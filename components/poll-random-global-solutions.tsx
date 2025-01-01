"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "next-auth"

import { getRandomGlobalSolutionPairAction } from "@/app/actions/getRandomGlobalSolutionPair"
import { PollSpecificGlobalSolutions } from "@/components/poll-specific-global-solutions"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  user?: User
}

export const PollRandomGlobalSolutions: React.FC<PollProps> = ({ user }) => {
  const [globalSolutions, setGlobalSolutions] = useState<{
    thisGlobalSolution?: any
    thatGlobalSolution?: any
  }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchGlobalSolutions = async () => {
    setLoading(true)
    const data = await getRandomGlobalSolutionPairAction()
    if (!data) {
      router.push("/globalSolutions/results")
      return
    }
    setGlobalSolutions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchGlobalSolutions()
    }
  }, [])

  if (
    loading ||
    !globalSolutions.thisGlobalSolution ||
    !globalSolutions.thatGlobalSolution
  ) {
    return <SpinningLoader />
  }

  return (
    <PollSpecificGlobalSolutions
      thisGlobalSolution={globalSolutions.thisGlobalSolution}
      thatGlobalSolution={globalSolutions.thatGlobalSolution}
      updatePair={fetchGlobalSolutions}
      user={user}
    />
  )
}
