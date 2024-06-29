import { useEffect, useState } from "react"

import { useUserIdClient } from "@/lib/useUserIdClient"

import { getDirContent } from "../chat/github/github"
import { Directory } from "../types"

export function useGetDirectoryContent(url: string) {
  const [fetchedData, setFetchedData] = useState<Directory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const userId = useUserIdClient()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const data = await getDirContent(url, userId ? userId : null)
      setFetchedData(data)
    })()

    setIsLoading(false)
  }, [url, userId])
  if (!fetchedData) {
    return null
  }
  return { fetchedData, isLoading }
}
