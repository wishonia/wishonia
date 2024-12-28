"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { postVoteData } from "@/lib/api/postVoteData"

const AfterLoginHandler = () => {
  const router = useRouter()
  useEffect(() => {
    // Ensure this code runs only in the browser
    if (typeof window !== "undefined") {
      postVoteData()
      const afterLoginRedirect = localStorage.getItem("afterLoginRedirect")
      if (afterLoginRedirect) {
        localStorage.removeItem("afterLoginRedirect")
        router.push(afterLoginRedirect)
      }
    }
  }, [])

  return null
}

export default AfterLoginHandler
