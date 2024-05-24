import {prisma as db} from "@/lib/db";

async function getVotersByReferrer(referrerUserId: string) {
    return db.user.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
        },
        where: {
            referrerUserId: referrerUserId,
        },
    });
}