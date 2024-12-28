'use server'

import { revalidatePath } from "next/cache"

import prisma from "@/lib/prisma"

export async function addUserSkill(userId: string, skillName: string) {
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

export async function removeUserSkill(userId: string, skillId: string) {
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