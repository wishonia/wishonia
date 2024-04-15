import { NextResponse } from "next/server";
import { db } from "@/lib/db"
import {getCurrentUser} from "@/lib/session";

export async function POST(
    req: Request
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        let { warPercentageDesired, referrerUserId  } = body;
        // Convert string to float
        warPercentageDesired = parseFloat(warPercentageDesired);

        if (!currentUser || !currentUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(referrerUserId) {
            const referrerUser = await db.user.findFirst({
                where: {
                  OR: [
                    { id: referrerUserId },
                    { username: referrerUserId },
                    { referrerUserId: referrerUserId }
                  ],
                },
              });
            if(referrerUser) {
                referrerUserId = referrerUser.id
            }
        }

        const data = {
            warPercentageDesired: warPercentageDesired,
            referrerUserId: referrerUserId,
        };
        const user = await db.user.update({
            where: {
                id: currentUser.id,
            },
            data: data,
        });

        return NextResponse.json("stored vote "+warPercentageDesired, { status: 201 });
    } catch (error) {
        console.log('[CONVERSATION_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
