import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db"
import {getCurrentUser} from "@/lib/session";
import { User } from "next-auth";
import {handleError} from "@/lib/errorHandler";
import {aggregateGlobalProblemPairAllocations} from "@/lib/globalProblems";
import {aggregateWishingWellPairAllocations} from "@/lib/wishingWells";

async function saveReferrerUserId(referrerUserId: string, currentUser: User & { id: string; username: string; }) {
    const referrerUser = await db.user.findFirst({
        where: {
            OR: [
                {id: referrerUserId},
                {username: referrerUserId},
                {referrerUserId: referrerUserId}
            ],
        },
    });
    if (referrerUser) {
        referrerUserId = referrerUser.id
    }
    const data = {
        referrerUserId: referrerUserId,
    };
    const user = await db.user.update({
        where: {
            id: currentUser.id,
        },
        data: data,
    });
    return referrerUserId;
}

export async function POST(
    req: Request
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !currentUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const body = await req.json();
        const userId = currentUser.id;
        let { wishingWellPairAllocation,
            referrerUserId,
            globalProblemPairAllocation
        } = body;
        if(referrerUserId) {await saveReferrerUserId(referrerUserId, currentUser);}
        if(wishingWellPairAllocation) {
            wishingWellPairAllocation.userId = currentUser.id;
            try {
                body.wishingWellPairAllocation = await db.wishingWellPairAllocation.create({
                    data: wishingWellPairAllocation,
                });
                aggregateWishingWellPairAllocations();
            } catch (error) {
                return handleError(error, 'Could not save globalProblemPairAllocation because:', {
                    error,
                    globalProblemPairAllocation,
                })
            }
        }
        if(globalProblemPairAllocation) {
            globalProblemPairAllocation.userId = userId;
            try {
                body.globalProblemPairAllocation = await db.globalProblemPairAllocation.create({
                    data: globalProblemPairAllocation,
                });
                aggregateGlobalProblemPairAllocations();
            } catch (error) {
                return handleError(error, 'Could not save globalProblemPairAllocation because:', {
                    error,
                    globalProblemPairAllocation,
                })
            }
        }

        return NextResponse.json(body, { status: 201 });
    } catch (error) {
        return handleError(error, 'Could not save vote because:', {
            error,
        })
    }
};
