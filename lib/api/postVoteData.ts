// apiUtils.ts
import { undefined } from "zod"

export const postVoteData = (): Promise<any> => {
  return new Promise((resolve, reject) => {
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
      resolve("No data to post to vote endpoint")
      return
    }
    fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data)
        resolve(data)
      })
      .catch((error) => {
        console.error("Error:", error)
        reject(error)
      })
  })
}
