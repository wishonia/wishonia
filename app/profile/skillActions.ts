'use server'

import prisma from "@/lib/prisma"
import { requireUserId } from "@/lib/api/getUserIdServer"
import { revalidatePath } from "next/cache"

export async function addUserSkill(skillName: string) {
    const userId = await requireUserId()
    const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
    })

    await prisma.userSkill.create({
        data: {
            userId: userId,
            skillId: skill.id,
        },
    })

    revalidatePath('/profile')
}

export async function removeUserSkill(skillId: string) {
    const userId = await requireUserId()
    await prisma.userSkill.delete({
        where: {
            userId_skillId: {
                userId: userId,
                skillId: skillId,
            },
        },
    })

    revalidatePath('/profile')
}

export async function searchSkills(searchTerm: string) {
    const skills = await prisma.skill.findMany({
        where: {
            name: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        },
        take: 5,
    })
    return skills
}