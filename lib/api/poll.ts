import { db } from "@/lib/db"

// Calculate the average warPercentageDesired
export async function getAverageWarPercentageDesired(): Promise<number> {
  const result = await db.user.aggregate({
    _avg: {
      warPercentageDesired: true,
    },
  });
  return result._avg.warPercentageDesired ?? 0;
}
