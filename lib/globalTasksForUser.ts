import { prisma } from '@/lib/db';
export async function getGlobalTasksForUser(userId: string | undefined) {
    const userWithSkills = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            userSkills: {  // Changed from 'skills' to 'userSkills'
                include: {
                    skill: true,
                },
            },
        },
    });

    if (!userWithSkills) {
        return []; // or handle the null case appropriately
    }

    const userSkills = userWithSkills.userSkills.map((userSkill) => userSkill.skill);

    const globalTasksWithRequiredSkills = await prisma.globalTask.findMany({
        where: {
            skills: {
                every: {
                    skill: {
                        id: {
                            in: userSkills.map((skill: { id: any; }) => skill.id),
                        },
                    },
                },
            },
        },
    });
    return globalTasksWithRequiredSkills;
}