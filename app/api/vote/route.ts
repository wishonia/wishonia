import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import prismadb from "@/lib/prismadb"
import { User } from "@clerk/nextjs/dist/types/server";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function upsertUser(user: User | null | any) {
  const { id, emailAddresses, phoneNumbers, web3Wallets, externalAccounts, ...userData } = user;

  // Upsert the user
  const upsertedUser = await prismadb.user.upsert({
    where: { id },
    update: userData,
    create: { ...userData, id },
  });

  // Upsert related models
  for (const emailAddress of emailAddresses) {
    await prismadb.emailAddress.upsert({
      where: { id: emailAddress.id },
      update: emailAddress,
      create: { ...emailAddress, userId: id, id: emailAddress.id },
    });
  }

  for (const phoneNumber of phoneNumbers) {
    await prismadb.phoneNumber.upsert({
      where: { id: phoneNumber.id },
      update: phoneNumber,
      create: { ...phoneNumber, userId: id, id: phoneNumber.id },
    });
  }

  for (const web3Wallet of web3Wallets) {
    await prismadb.web3Wallet.upsert({
      where: { id: web3Wallet.id },
      update: web3Wallet,
      create: { ...web3Wallet, userId: id, id: web3Wallet.id },
    });
  }

  for (const externalAccount of externalAccounts) {
    await prismadb.externalAccount.upsert({
      where: { id: externalAccount.id },
      update: externalAccount,
      create: { ...externalAccount, userId: id, id: externalAccount.id },
    });
  }

  return upsertedUser;
}

export async function POST(
    req: Request
) {
    try {
        const user = await currentUser();

        await upsertUser(user);
        const body = await req.json();
        let { warPercentageDesired  } = body;
        // Convert string to float
        warPercentageDesired = parseFloat(warPercentageDesired);

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let voter = await prismadb.voter.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!voter) {
            voter = await prismadb.voter.create({
                data: {
                    id: user.id,
                    warPercentageDesired: warPercentageDesired,
                },
            });
        } else {
            voter = await prismadb.voter.update({
                where: {
                    id: user.id,
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
