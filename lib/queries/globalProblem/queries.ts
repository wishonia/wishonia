import { Prisma } from '@prisma/client'

import prisma from '@/lib/prisma'

type GlobalProblemRelationshipsReturn = {
  organizations: Prisma.OrganizationGlobalProblemGetPayload<{
    include: { organization: true }
  }>[]
  people: Prisma.PersonGlobalProblemGetPayload<{
    include: { person: true }
  }>[]
  total: {
    organizations: number
    people: number
  }
}

export async function getGlobalProblemRelationships(
  problemId: string,
  limit = 10
): Promise<GlobalProblemRelationshipsReturn> {
  const [existingOrgs, existingPeople, totalOrgs, totalPeople] = await Promise.all([
    prisma.organizationGlobalProblem.findMany({
      where: { globalProblemId: problemId },
      include: { organization: true },
      orderBy: { focusLevel: 'desc' },
      take: limit
    }),
    prisma.personGlobalProblem.findMany({
      where: { globalProblemId: problemId },
      include: { person: true },
      orderBy: { expertise: 'desc' },
      take: limit
    }),
    prisma.organizationGlobalProblem.count({
      where: { globalProblemId: problemId }
    }),
    prisma.personGlobalProblem.count({
      where: { globalProblemId: problemId }
    })
  ])

  return {
    organizations: existingOrgs,
    people: existingPeople,
    total: {
      organizations: totalOrgs,
      people: totalPeople
    }
  }
}

type GlobalSolutionRelationshipsReturn = {
  organizations: Prisma.OrganizationGlobalSolutionGetPayload<{
    include: { organization: true }
  }>[]
  people: Prisma.PersonGlobalSolutionGetPayload<{
    include: { person: true }
  }>[]
  total: {
    organizations: number
    people: number
  }
}

export async function getGlobalSolutionRelationships(
  solutionId: string,
  limit = 10
): Promise<GlobalSolutionRelationshipsReturn> {
  const [existingOrgs, existingPeople, totalOrgs, totalPeople] = await Promise.all([
    prisma.organizationGlobalSolution.findMany({
      where: { globalSolutionId: solutionId },
      include: { organization: true },
      orderBy: { focusLevel: 'desc' },
      take: limit
    }),
    prisma.personGlobalSolution.findMany({
      where: { globalSolutionId: solutionId },
      include: { person: true },
      orderBy: { expertise: 'desc' },
      take: limit
    }),
    prisma.organizationGlobalSolution.count({
      where: { globalSolutionId: solutionId }
    }),
    prisma.personGlobalSolution.count({
      where: { globalSolutionId: solutionId }
    })
  ])

  return {
    organizations: existingOrgs,
    people: existingPeople,
    total: {
      organizations: totalOrgs,
      people: totalPeople
    }
  }
} 