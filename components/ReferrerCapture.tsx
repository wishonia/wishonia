"use client"

import { useEffect } from "react"

//import {useRouter} from "next/router";

const ReferrerCapture = (params: { referrerId: string }) => {
  //const router = useRouter()
  useEffect(() => {
    localStorage.setItem("referrerId", params.referrerId)
    window.location.href = "/"
  }, [params.referrerId])
  return null // This component doesn't render anything
}

export default ReferrerCapture
