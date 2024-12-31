"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "next-auth"

import { getRandomWishingWellPair } from "@/app/actions/getRandomWishingWellPair"
import { PollSpecificWishingWells } from "@/components/poll-specific-wishing-wells"
import { SpinningLoader } from "@/components/spinningLoader"

interface PollProps {
  user?: User
}

export const PollRandomWishingWells: React.FC<PollProps> = ({ user }) => {
  const [wishingWells, setWishingWells] = useState<{
    thisWishingWell?: any
    thatWishingWell?: any
  }>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const fetchWishingWells = async () => {
    try {
      setLoading(true)
      const data = await getRandomWishingWellPair()
      if (!data.thisWishingWell || !data.thatWishingWell) {
        router.push("/wishingWells/results")
        return
      }
      setWishingWells(data)
    } catch (error) {
      console.error("Error fetching wishing wells:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchWishingWells()
    }
  }, [])

  if (loading || !wishingWells.thisWishingWell || !wishingWells.thatWishingWell) {
    return <SpinningLoader />
  }

  return (
    <PollSpecificWishingWells
      thisWishingWell={wishingWells.thisWishingWell}
      thatWishingWell={wishingWells.thatWishingWell}
      updatePair={fetchWishingWells}
      user={user}
    />
  )
}
