import { z } from 'zod'
import { CompanyType, FocusLevel, ExpertiseLevel } from '@prisma/client'

export const GeneratedOrganizationSchema = z.object({
  organizations: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    industry: z.string().optional(),
    mission: z.string().optional(),
    companyType: z.nativeEnum(CompanyType).optional(),
    headquartersLocation: z.string().optional(),
    focusLevel: z.nativeEnum(FocusLevel),
    achievements: z.array(z.string())
  }))
})

export const GeneratedPersonSchema = z.object({
  people: z.array(z.object({
    name: z.string(),
    bio: z.string().optional(),
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    expertise: z.nativeEnum(ExpertiseLevel),
    role: z.string(),
    achievements: z.array(z.string()),
    publications: z.array(z.string())
  }))
}) 