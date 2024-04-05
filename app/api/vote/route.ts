import { NextResponse } from "next/server";
import { db } from "@/lib/db"
import {getCurrentUser} from "@/lib/session";

export async function POST(
    req: Request
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        let { warPercentageDesired  } = body;
        // Convert string to float
        warPercentageDesired = parseFloat(warPercentageDesired);

        if (!currentUser || !currentUser.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.update({
            where: {
                id: currentUser.id,
            },
            data: {
                warPercentageDesired: warPercentageDesired,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log('[CONVERSATION_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
