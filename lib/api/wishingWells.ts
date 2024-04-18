import { WishingWell, User } from "@prisma/client"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

type UserWishingWells = WishingWell & {
  total_count: number
}

// Fetch user's wishingWell
export async function getUserWishingWell(
  wishingWellId: WishingWell["id"],
  userId: User["id"]
) {
  return await db.wishingWell.findFirst({
    where: {
      id: wishingWellId,
      userId: userId,
    },
  })
}

// Fetch all of the wishingWells for the selected user
export async function getUserWishingWells(
  userId: string
): Promise<UserWishingWells[]> {
  const results: UserWishingWells[] = await db.$queryRaw`
    SELECT
      A.id,
      A.name,
      A.description,
      A.created_at AS "createdAt",
      SUM(AL.count) AS total_count
    FROM
      wishingWells A
    LEFT JOIN
      wishing_well_contribution AL ON A.id = AL.wishingWell_id
    WHERE
      A.user_id = ${userId}
    GROUP BY
      A.id, A.name, A.description, A.color_code
    ORDER BY
      total_count DESC;`

  return results.map((result) => ({
    ...result,
    total_count: Number(result.total_count),
  }))
}

// Verify if the user has access to the wishingWell
export async function verifyWishingWell(wishingWellId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.wishingWell.count({
    where: {
      id: wishingWellId,
      userId: session?.user.id,
    },
  })

  return count > 0
}