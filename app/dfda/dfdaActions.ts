"use server"
import { prisma } from "@/lib/db"
import { Effectiveness } from "@prisma/client"

export async function fetchConditions() {
    return prisma.dfdaCondition.findMany();
}

export async function fetchTreatments(userId: string, conditionName: string) {
    return []
}

export async function addTreatment(userId: string, conditionName: string, treatmentName: string, effectiveness: Effectiveness) {

    const treatment = await prisma.dfdaTreatment.findUnique({
        where: {
            name: treatmentName
        }
    })

    if (!treatment) {
        throw new Error("Treatment not found")
    }

    const condition = await prisma.dfdaCondition.findUnique({
        where: {
            name: conditionName
        }
    })

    if (!condition) {
        throw new Error("Condition not found")
    }

    const userTreatment = await prisma.dfdaUserTreatmentReport.create({
        data: {
            userId,
            conditionId: condition.id,
            treatmentId: treatment.id,
            effectiveness,
            tried: true // Add this line
        }
    })

    return userTreatment
}

export async function updateTreatmentReport(userId: string, conditionName: string, treatmentName: string, effectiveness: Effectiveness) {

    const treatment = await prisma.dfdaTreatment.findUnique({
        where: {
            name: treatmentName
        }
    })

    if (!treatment) {
        throw new Error("Treatment not found")
    }

    const condition = await prisma.dfdaCondition.findUnique({
        where: {
            name: conditionName
        }
    })

    if (!condition) {
        throw new Error("Condition not found")
    }

    const userTreatment = await prisma.dfdaUserTreatmentReport.update({
        where: {
            userId_treatmentId_conditionId: {
                userId,
                conditionId: condition.id,
                treatmentId: treatment.id
            }
        },
        data: {
            effectiveness
        }
    })

    return userTreatment
}
