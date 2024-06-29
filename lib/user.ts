import { ExtendedUser } from "@/types/auth"
import { prisma as db } from "@/lib/db"

export async function saveReferrerUserId(
  referrerUserId: string,
  currentUser: ExtendedUser
) {
  const referrerUser = await db.user.findFirst({
    where: {
      OR: [
        { id: referrerUserId },
        { username: referrerUserId },
        { referrerUserId: referrerUserId },
      ],
    },
  })
  if (referrerUser) {
    referrerUserId = referrerUser.id
  }
  const data = {
    referrerUserId: referrerUserId,
  }
  const user = await db.user.update({
    where: {
      id: currentUser.id,
    },
    data: data,
  })
  return referrerUserId
}
