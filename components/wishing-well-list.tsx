"use client"

import { WishingWell } from "@prisma/client"
import { User } from "next-auth"
import React, { useEffect, useState } from "react"

import { DataTable } from "@/components/data-table"
import { SpinningLoader } from "@/components/spinningLoader"
import { wishingWellColumns } from "@/components/wishing-well-columns"

interface PollProps {
  user?: User
}

export const WishingWellsList: React.FC<PollProps> = ({ user }) => {
  const [wishingWells, setWishingWells] = useState<WishingWell[]>([])
  const [loading, setLoading] = useState(false)
  const fetchWishingWells = async () => {
    setLoading(true)
    const response = await fetch("/api/wishingWells")
    const data = await response.json()
    setWishingWells(data)
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) {
      fetchWishingWells()
    }
  }, [])

  if (loading || !wishingWells || wishingWells.length === 0) {
    return <SpinningLoader />
  }

  return (
    <>
      {/*<WishingWellsPieChart data={wishingWells}></WishingWellsPieChart>*/}
      <DataTable columns={wishingWellColumns} data={wishingWells} />
    </>
  )
}
