import { prisma as db } from "@/lib/db"

// Calculate the average warPercentageDesired
export const warGlobalSolutionId = "war"
export const medicalResearchGlobalSolutionId = "medical-research"
export async function getAverageWarPercentageDesired(): Promise<number> {
  const result = await db.globalSolutionPairAllocation.aggregate({
    _avg: {
      thisGlobalSolutionPercentage: true,
    },
    where: {
      thisGlobalSolutionId: warGlobalSolutionId,
      thatGlobalSolutionId: medicalResearchGlobalSolutionId,
    },
  })
  return result._avg.thisGlobalSolutionPercentage ?? 0
  // const result = await db.user.aggregate({
  //   _avg: {
  //     warPercentageDesired: true,
  //   },
  // });
  // return result._avg.warPercentageDesired ?? 0;
}
