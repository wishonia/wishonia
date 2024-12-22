import { getGlobalProblemRelationships as _getGlobalProblemRelationships, getGlobalSolutionRelationships as _getGlobalSolutionRelationships } from './globalProblem/queries'
import { generateOrganizations as _generateOrganizations, generatePeople as _generatePeople } from './globalProblem/generators'
import type { Prisma } from '@prisma/client'

// Re-export the types from Prisma
export type GlobalProblemRelationships = {
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

// Re-export the functions with the same interface
export const getGlobalProblemRelationships = _getGlobalProblemRelationships
export const getGlobalSolutionRelationships = _getGlobalSolutionRelationships
export const generateOrganizations = _generateOrganizations
export const generatePeople = _generatePeople 