import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import prismadb from "@/lib/prismadb"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { warPercentageDesired  } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let voter = await prismadb.voter.findUnique({
            where: {
                userId: userId,
            },
        });

        if (!voter) {
            voter = await prismadb.voter.create({
                data: {
                    userId: userId,
                    warPercentageDesired: warPercentageDesired,
                },
            });
        } else {
            voter = await prismadb.voter.update({
                where: {
                    userId: userId,
                },
                data: {
                    warPercentageDesired: warPercentageDesired,
                },
            });
        }

        return NextResponse.json(voter);
    } catch (error) {
        console.log('[CONVERSATION_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
