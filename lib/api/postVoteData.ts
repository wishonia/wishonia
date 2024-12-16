// apiUtils.ts
import { undefined } from "zod"

export const postVoteData = async (): Promise<any> => {
  let referrerUserId = localStorage.getItem("referrerUserId")
  localStorage.removeItem("referrerUserId")
  const wishingWellPairAllocation = localStorage.getItem(
    "wishingWellPairAllocation"
  )
  localStorage.removeItem("wishingWellPairAllocation")
  const globalProblemPairAllocation = localStorage.getItem(
    "globalProblemPairAllocation"
  )
  localStorage.removeItem("globalProblemPairAllocation")
  const globalSolutionPairAllocation = localStorage.getItem(
    "globalSolutionPairAllocation"
  )
  localStorage.removeItem("globalSolutionPairAllocation")
  const globalProblemSolutionPairAllocation = localStorage.getItem(
    "globalProblemSolutionPairAllocation"
  )
  localStorage.removeItem("globalProblemSolutionPairAllocation")

  const data = {
    referrerUserId: referrerUserId || undefined,
    wishingWellPairAllocation: undefined,
    globalProblemPairAllocation: undefined,
    globalSolutionPairAllocation: undefined,
    globalProblemSolutionPairAllocation: undefined,
  }

  let post = false
  if (wishingWellPairAllocation) {
    data.wishingWellPairAllocation = JSON.parse(wishingWellPairAllocation)
    post = true
  }
  if (globalProblemPairAllocation) {
    data.globalProblemPairAllocation = JSON.parse(globalProblemPairAllocation)
    post = true
  }
  if (globalSolutionPairAllocation) {
    data.globalSolutionPairAllocation = JSON.parse(
      globalSolutionPairAllocation
    )
    post = true
  }
  if (globalProblemSolutionPairAllocation) {
    data.globalProblemSolutionPairAllocation = JSON.parse(
      globalProblemSolutionPairAllocation
    )
    post = true
  }

  if (!post) {
    return "No data to post to vote endpoint"
  }

  try {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    console.log("Success:", responseData)
    return responseData
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}
