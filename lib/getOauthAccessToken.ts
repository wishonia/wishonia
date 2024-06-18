import { prisma } from '@/lib/db';
export async function getUserOauthAccessToken(userId: string, provider: string): Promise<string | null> {
    if (!userId || !provider) {
        throw new Error('Missing userId or provider');
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: provider
        },
        select: {
            access_token: true
        }
    });

    if (!account) {
        console.error(`No account found for user ${userId} with provider ${provider}`);
        return null;
    }

    return account.access_token;
}

export async function getGithubAccessToken(userId: string): Promise<string> {
    const str =  await getUserOauthAccessToken(userId, 'github');
    if (!str) {
        throw new Error(`No GitHub access token found for user ${userId}`);
    }
    return str;
}