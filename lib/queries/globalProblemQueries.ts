import { generateObject } from 'ai'
import { z } from 'zod'
import { CompanyType, ExpertiseLevel, FocusLevel, Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getModel } from '@/lib/utils/modelUtils'

// Types
export type RelatedOrganization = {
  id: string;
  name: string;
  description: string | null;
  industry: string | null;
  mission: string | null;
  companySize: string | null;
  companyType: CompanyType | null;
  headquartersLocation: string | null;
  url: string | null;
  focusLevel: FocusLevel;
  achievements: string[];
}

export type RelatedPerson = {
  id: string;
  name: string;
  bio: string | null;
  jobTitle: string | null;
  company: string | null;
  location: string | null;
  image: string | null;
  expertise: ExpertiseLevel;
  role: string;
  achievements: string[];
  publications: string[];
}

export interface GlobalProblemRelationships {
  organizations: RelatedOrganization[];
  people: RelatedPerson[];
  total: {
    organizations: number;
    people: number;
  };
}

// Generation schemas
const GeneratedOrganizationSchema = z.object({
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

const GeneratedPersonSchema = z.object({
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

// Generation functions
async function generateOrganizations(topic: string, count: number, type: 'problem' | 'solution', context?: string) {
  const prompt = `Generate ${count} key organizations ${type === 'problem' ? 'working on' : 'implementing solutions for'} ${topic}.
    ${context ? `Context: ${context}` : ''}
    
    Include:
    - Real organization names and details
    - Their focus level on this ${type} (LOW, MEDIUM, HIGH, PRIMARY)
    - Key achievements in ${type === 'problem' ? 'addressing the problem' : 'implementing the solution'}
    
    Make all data realistic and fact-based.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedOrganizationSchema,
    prompt,
  })

  return result.object.organizations
}

async function generatePeople(topic: string, count: number, type: 'problem' | 'solution', context?: string) {
  const prompt = `Generate ${count} key people ${type === 'problem' ? 'working on' : 'implementing'} ${topic}.
    ${context ? `Context: ${context}` : ''}
    
    Include:
    - Real researchers and experts
    - Their expertise level (BEGINNER, MEDIUM, EXPERT, AUTHORITY)
    - Their role and achievements
    - Key publications related to ${type === 'problem' ? 'the problem' : 'implementing the solution'}
    
    Make all data realistic and fact-based.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedPersonSchema,
    prompt,
  })

  return result.object.people
}

// Main query functions
export async function getGlobalProblemRelationships(
  problemId: string, 
  limit = 10
): Promise<GlobalProblemRelationships> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [Query] Getting relationships for problem:', problemId)
  }

  // Get existing relationships
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

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [Query] Found existing relationships:', {
      organizations: existingOrgs.length,
      people: existingPeople.length
    })
  }

  return {
    organizations: existingOrgs.map(mapOrganizationRelation),
    people: existingPeople.map(mapPersonRelation),
    total: {
      organizations: totalOrgs,
      people: totalPeople
    }
  }
}

export async function getGlobalSolutionRelationships(
  solutionId: string, 
  limit = 10
): Promise<GlobalProblemRelationships> {
  const solution = await prisma.globalSolution.findUniqueOrThrow({
    where: { id: solutionId },
    select: { name: true, description: true }
  })

  // Get existing relationships
  const [existingOrgs, existingPeople] = await Promise.all([
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
    })
  ])

  // Generate more if needed
  const [newOrgs, newPeople] = await Promise.all([
    existingOrgs.length < limit ? generateAndSaveOrganizationsForSolution(solution, solutionId, limit - existingOrgs.length) : [],
    existingPeople.length < limit ? generateAndSavePeopleForSolution(solution, solutionId, limit - existingPeople.length) : []
  ])

  return {
    organizations: [
      ...existingOrgs.map(mapOrganizationRelation),
      ...newOrgs
    ],
    people: [
      ...existingPeople.map(mapPersonRelation),
      ...newPeople
    ],
    total: {
      organizations: await prisma.organizationGlobalSolution.count({ where: { globalSolutionId: solutionId } }),
      people: await prisma.personGlobalSolution.count({ where: { globalSolutionId: solutionId } })
    }
  }
}

// Helper functions
function mapOrganizationRelation(rel: Prisma.OrganizationGlobalProblemGetPayload<{ include: { organization: true } }> | Prisma.OrganizationGlobalSolutionGetPayload<{ include: { organization: true } }>): RelatedOrganization {
  return {
    id: rel.organization.id,
    name: rel.organization.name,
    description: rel.organization.description,
    industry: rel.organization.industry,
    mission: rel.organization.mission,
    companySize: rel.organization.companySize,
    companyType: rel.organization.companyType,
    headquartersLocation: rel.organization.headquartersLocation,
    url: rel.organization.url,
    focusLevel: rel.focusLevel,
    achievements: rel.achievements
  }
}

function mapPersonRelation(rel: Prisma.PersonGlobalProblemGetPayload<{ include: { person: true } }> | Prisma.PersonGlobalSolutionGetPayload<{ include: { person: true } }>): RelatedPerson {
  return {
    id: rel.person.id,
    name: rel.person.name,
    bio: rel.person.bio,
    jobTitle: rel.person.jobTitle,
    company: rel.person.company,
    location: rel.person.location,
    image: rel.person.image,
    expertise: rel.expertise,
    role: rel.role || 'Unknown',
    achievements: rel.achievements,
    publications: rel.publications
  }
}

async function generateAndSaveOrganizations(
  problem: { name: string; description: string | null },
  problemId: string,
  count: number
): Promise<RelatedOrganization[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log('🏢 [Organizations] Generating and saving organizations for:', problem.name)
  }

  const generatedOrgs = await generateOrganizations(problem.name, count, 'problem', problem.description || undefined)
  
  return Promise.all(
    generatedOrgs.map(async (org) => {
      const slug = org.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      
      try {
        const saved = await prisma.organization.upsert({
          where: { name: org.name },
          update: {
            description: org.description || undefined,
            industry: org.industry || undefined,
            mission: org.mission || undefined,
            companyType: org.companyType || undefined,
            headquartersLocation: org.headquartersLocation || undefined,
            globalProblems: {
              create: {
                globalProblemId: problemId,
                focusLevel: org.focusLevel,
                achievements: org.achievements
              }
            }
          },
          create: {
            name: org.name,
            slug: `${slug}-${Date.now()}`,
            description: org.description || undefined,
            industry: org.industry || undefined,
            mission: org.mission || undefined,
            companyType: org.companyType || undefined,
            headquartersLocation: org.headquartersLocation || undefined,
            globalProblems: {
              create: {
                globalProblemId: problemId,
                focusLevel: org.focusLevel,
                achievements: org.achievements
              }
            }
          },
          include: {
            globalProblems: {
              where: { globalProblemId: problemId },
              take: 1
            }
          }
        })

        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [Organizations] Saved/updated organization: ${saved.name}`)
        }

        return {
          id: saved.id,
          name: saved.name,
          description: saved.description,
          industry: saved.industry,
          mission: saved.mission,
          companySize: saved.companySize,
          companyType: saved.companyType,
          headquartersLocation: saved.headquartersLocation,
          url: saved.url,
          focusLevel: saved.globalProblems[0]?.focusLevel || org.focusLevel,
          achievements: saved.globalProblems[0]?.achievements || org.achievements
        }
      } catch (error) {
        console.error(`❌ [Organizations] Error saving organization ${org.name}:`, error)
        throw error
      }
    })
  )
}

async function generateAndSavePeople(
  problem: { name: string; description: string | null },
  problemId: string,
  count: number
): Promise<RelatedPerson[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log('👥 [People] Generating and saving people for:', problem.name)
  }

  const generatedPeople = await generatePeople(problem.name, count, 'problem', problem.description || undefined)
  
  return Promise.all(
    generatedPeople.map(async (person) => {
      try {
        type PersonWithProblems = Prisma.PersonGetPayload<{
          include: {
            globalProblems: {
              where: { globalProblemId: string };
              take: 1;
            };
          };
        }>;

        const saved = await prisma.person.upsert({
          where: {
            id: `${person.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
          },
          update: {
            bio: person.bio || undefined,
            jobTitle: person.jobTitle || undefined,
            company: person.company || undefined,
            location: person.location || undefined,
            globalProblems: {
              upsert: {
                where: {
                  personId_globalProblemId: {
                    personId: '', // Will be filled by Prisma
                    globalProblemId: problemId
                  }
                },
                create: {
                  globalProblemId: problemId,
                  expertise: person.expertise,
                  role: person.role,
                  achievements: person.achievements,
                  publications: person.publications
                },
                update: {
                  expertise: person.expertise,
                  role: person.role,
                  achievements: person.achievements,
                  publications: person.publications
                }
              }
            }
          },
          create: {
            id: `${person.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            name: person.name,
            email: `${person.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            userId: 'system', // Required field
            bio: person.bio || undefined,
            jobTitle: person.jobTitle || undefined,
            company: person.company || undefined,
            location: person.location || undefined,
            globalProblems: {
              create: {
                globalProblemId: problemId,
                expertise: person.expertise,
                role: person.role,
                achievements: person.achievements,
                publications: person.publications
              }
            }
          },
          include: {
            globalProblems: {
              where: { globalProblemId: problemId },
              take: 1
            }
          }
        }) as PersonWithProblems

        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ [People] Saved/updated person: ${saved.name}`)
        }

        const personRelation = saved.globalProblems[0]

        return {
          id: saved.id,
          name: saved.name,
          bio: saved.bio,
          jobTitle: saved.jobTitle,
          company: saved.company,
          location: saved.location,
          image: saved.image,
          expertise: personRelation?.expertise || person.expertise,
          role: personRelation?.role || person.role,
          achievements: personRelation?.achievements || person.achievements,
          publications: personRelation?.publications || person.publications
        }
      } catch (error) {
        console.error(`❌ [People] Error saving person ${person.name}:`, error)
        throw error
      }
    })
  )
}

async function generateAndSaveOrganizationsForSolution(
  solution: { name: string; description: string | null },
  solutionId: string,
  count: number
): Promise<RelatedOrganization[]> {
  const generatedOrgs = await generateOrganizations(solution.name, count, 'solution', solution.description || undefined)
  
  return Promise.all(
    generatedOrgs.map(async (org) => {
      const slug = org.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const saved = await prisma.organization.create({
        data: {
          name: org.name,
          slug: `${slug}-${Date.now()}`,
          description: org.description,
          industry: org.industry,
          mission: org.mission,
          companyType: org.companyType,
          headquartersLocation: org.headquartersLocation,
          globalSolutions: {
            create: {
              globalSolutionId: solutionId,
              focusLevel: org.focusLevel,
              achievements: org.achievements
            }
          }
        },
        include: {
          globalSolutions: true
        }
      })

      return {
        id: saved.id,
        name: saved.name,
        description: saved.description,
        industry: saved.industry,
        mission: saved.mission,
        companySize: saved.companySize,
        companyType: saved.companyType,
        headquartersLocation: saved.headquartersLocation,
        url: saved.url,
        focusLevel: saved.globalSolutions[0].focusLevel,
        achievements: saved.globalSolutions[0].achievements
      }
    })
  )
}

async function generateAndSavePeopleForSolution(
  solution: { name: string; description: string | null },
  solutionId: string,
  count: number
): Promise<RelatedPerson[]> {
  const generatedPeople = await generatePeople(solution.name, count, 'solution', solution.description || undefined)
  
  return Promise.all(
    generatedPeople.map(async (person) => {
      const saved = await prisma.person.create({
        data: {
          name: person.name,
          bio: person.bio,
          jobTitle: person.jobTitle,
          company: person.company,
          location: person.location,
          globalSolutions: {
            create: {
              globalSolutionId: solutionId,
              expertise: person.expertise,
              role: person.role || 'Unknown',
              achievements: person.achievements,
              publications: person.publications
            }
          }
        },
        include: {
          globalSolutions: true
        }
      })

      return {
        id: saved.id,
        name: saved.name,
        bio: saved.bio,
        jobTitle: saved.jobTitle,
        company: saved.company,
        location: saved.location,
        image: saved.image,
        expertise: saved.globalSolutions[0].expertise,
        role: saved.globalSolutions[0].role || 'Unknown',
        achievements: saved.globalSolutions[0].achievements,
        publications: saved.globalSolutions[0].publications
      }
    })
  )
} 