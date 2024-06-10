import {octokit} from "@/lib/github/octokit";
import {prisma} from "@/lib/db";

export async function getGithubUser(username: string): Promise<any> {
    const userResponse =
        await octokit.users.getByUsername({ username });
    let githubUser = await prisma.githubUser.findUnique({
        where: {
            id: userResponse.data.id,
        },
    })
    if(!githubUser) {
        githubUser = await prisma.githubUser.create({
            data: userResponse.data,
        });
    }
    return githubUser;
}