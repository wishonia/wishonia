import { generateObject } from 'ai'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { getModel } from '@/lib/utils/modelUtils'
import { 
  CompanySize, 
  CompanyType, 
  ExpertiseLevel, 
  FocusLevel 
} from '@prisma/client'

// Use Prisma generated types with includes
type OrganizationMembershipWithPerson = Prisma.OrganizationMembershipGetPayload<{
  include: { person: true }
}>

type OrganizationGlobalProblemWithProblem = Prisma.OrganizationGlobalProblemGetPayload<{
  include: { globalProblem: true }
}>

type OrganizationGlobalSolutionWithSolution = Prisma.OrganizationGlobalSolutionGetPayload<{
  include: { globalSolution: true }
}>

export interface OrganizationRelationships {
  members: OrganizationMembershipWithPerson[]
  products: Prisma.ProductGetPayload<{}>[]
  services: Prisma.ServiceGetPayload<{}>[]
  partnerships: Prisma.PartnershipGetPayload<{}>[]
  globalProblems: OrganizationGlobalProblemWithProblem[]
  globalSolutions: OrganizationGlobalSolutionWithSolution[]
  total: {
    members: number
    products: number
    services: number
    partnerships: number
    globalProblems: number
    globalSolutions: number
  }
}

// Generation schemas
const GeneratedMemberSchema = z.object({
  members: z.array(z.object({
    name: z.string().describe('Full name of the person (e.g. "Dr. Jane Smith")'),
    role: z.string().describe('Professional role or position in the organization (e.g. "Chief Research Officer", "Lead Developer", "Board Member")'),
    bio: z.string().optional().describe('Brief professional biography highlighting expertise and background'),
    jobTitle: z.string().optional().describe('Specific job title within the organization (e.g. "Senior Software Engineer", "Director of Sustainability")'),
    location: z.string().optional().describe('City and country or region where the person is based (e.g. "London, UK", "San Francisco Bay Area")'),
    company: z.string().optional().describe('Current or previous company affiliation'),
    githubUsername: z.string().optional().describe('GitHub username if available'),
    hireable: z.boolean().optional().describe('Whether the person is open to new opportunities'),
    blog: z.string().optional().describe('Personal or professional blog URL')
  })).describe('List of organization members with their roles and professional details')
})

const GeneratedProductSchema = z.object({
  products: z.array(z.object({
    name: z.string().describe('Name of the product (e.g. "Sustainable Energy Battery", "Carbon Capture Unit")'),
    description: z.string().optional().describe('Clear description of the product, its features and benefits'),
    price: z.number().describe('Price in the specified currency (use realistic market prices)'),
    currency: z.string().describe('Three-letter currency code (e.g. "USD", "EUR", "GBP")'),
    referralUrl: z.string().optional().describe('URL to product page or sales information')
  })).describe('List of products offered by the organization')
})

const GeneratedServiceSchema = z.object({
  services: z.array(z.object({
    name: z.string().describe('Name of the service (e.g. "Sustainability Consulting", "Carbon Footprint Assessment")'),
    description: z.string().optional().describe('Detailed description of the service, its scope and benefits'),
    price: z.number().describe('Price in the specified currency (use realistic market rates)'),
    currency: z.string().describe('Three-letter currency code (e.g. "USD", "EUR", "GBP")'),
    referralUrl: z.string().optional().describe('URL to service information or booking page')
  })).describe('List of services provided by the organization')
})

const GeneratedPartnershipSchema = z.object({
  partnerships: z.array(z.object({
    partnerName: z.string().describe('Name of the partner organization (use real organizations when possible)'),
    description: z.string().optional().describe('Description of the partnership, its goals and collaborative efforts'),
    startDate: z.string().describe('Partnership start date (ISO format, within last 5 years)'),
    endDate: z.string().optional().describe('Partnership end date if applicable (ISO format, after start date)')
  })).describe('List of organizational partnerships and collaborations')
})

const GeneratedOrganizationSchema = z.object({
  organizations: z.array(z.object({
    name: z.string().describe('Organization name'),
    description: z.string().optional().describe('Organization description'),
    industry: z.string().optional().describe('Industry sector'),
    companySize: z.nativeEnum(CompanySize).optional().describe('Size of the company (STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE)'),
    companyType: z.nativeEnum(CompanyType).optional().describe('Type of company (PUBLIC, PRIVATE, NONPROFIT, GOVERNMENT, EDUCATIONAL)'),
    headquartersLocation: z.string().optional().describe('Location of headquarters'),
    focusLevel: z.nativeEnum(FocusLevel).describe('Level of focus on the problem/solution (LOW, MEDIUM, HIGH, PRIMARY)'),
    achievements: z.array(z.string()).describe('Key achievements and milestones')
  })).describe('List of organizations and their details')
})

// Generation functions
async function generateMembers(
  organization: { name: string; description: string | null },
  count: number
): Promise<Partial<Prisma.PersonCreateInput & { role: string }>[]> {
  const prompt = `Generate ${count} realistic members for the organization "${organization.name}".
    ${organization.description ? `Organization description: ${organization.description}` : ''}
    
    Include:
    - Real-sounding names
    - Professional roles
    - Brief bios
    - Job titles
    - Locations
    
    Make all data realistic and professional.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedMemberSchema,
    prompt,
  })

  return result.object.members.map(member => ({
    name: member.name,
    role: member.role,
    bio: member.bio,
    jobTitle: member.jobTitle,
    location: member.location
  }))
}

async function generateProducts(
  organization: { name: string; description: string | null },
  count: number
): Promise<Partial<Prisma.ProductCreateInput>[]> {
  const prompt = `Generate ${count} realistic products for the organization "${organization.name}".
    ${organization.description ? `Organization description: ${organization.description}` : ''}
    
    Include:
    - Product names
    - Descriptions
    - Realistic prices (in USD)
    - Optional referral URLs
    
    Make all data realistic and market-appropriate.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedProductSchema,
    prompt,
  })

  return result.object.products.map(product => ({
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    referralUrl: product.referralUrl,
    available: true
  }))
}

async function generateServices(
  organization: { name: string; description: string | null },
  count: number
): Promise<Partial<Prisma.ServiceCreateInput>[]> {
  const prompt = `Generate ${count} realistic services for the organization "${organization.name}".
    ${organization.description ? `Organization description: ${organization.description}` : ''}
    
    Include:
    - Service names
    - Descriptions
    - Realistic prices (in USD)
    - Optional referral URLs
    
    Make all data realistic and market-appropriate.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedServiceSchema,
    prompt,
  })

  return result.object.services.map(service => ({
    name: service.name,
    description: service.description,
    price: service.price,
    currency: service.currency,
    referralUrl: service.referralUrl,
    available: true
  }))
}

async function generatePartnerships(
  organization: { name: string; description: string | null },
  count: number
): Promise<Partial<Prisma.PartnershipCreateInput>[]> {
  const prompt = `Generate ${count} realistic partnerships for the organization "${organization.name}".
    ${organization.description ? `Organization description: ${organization.description}` : ''}
    
    Include:
    - Partner organization names
    - Partnership descriptions
    - Realistic start dates (within last 5 years)
    - Optional end dates
    
    Make all data realistic and industry-appropriate.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedPartnershipSchema,
    prompt,
  })

  return result.object.partnerships.map(partnership => ({
    partnerName: partnership.partnerName,
    description: partnership.description,
    startDate: new Date(partnership.startDate),
    endDate: partnership.endDate ? new Date(partnership.endDate) : null
  }))
}

// Helper function to generate and save members
async function generateAndSaveMembers(
  organization: { id: string; name: string; description: string | null },
  count: number
): Promise<OrganizationMembershipWithPerson[]> {
  const generatedMembers = await generateMembers(organization, count)
  
  return Promise.all(
    generatedMembers.map(async (member) => {
      try {
        const person = await prisma.person.create({
          data: {
            name: member.name!,
            bio: member.bio,
            jobTitle: member.jobTitle,
            location: member.location,
            memberships: {
              create: {
                organizationId: organization.id,
                role: member.role,
                startDate: new Date()
              }
            }
          }
        })

        return {
          id: person.id,
          name: person.name,
          role: member.role!,
          startDate: new Date(),
          endDate: null,
          bio: person.bio,
          jobTitle: person.jobTitle,
          location: person.location,
          image: person.image
        }
      } catch (error) {
        console.error(`Error saving member ${member.name}:`, error)
        throw error
      }
    })
  )
}

// Helper function to generate and save products
async function generateAndSaveProducts(
  organization: { id: string; name: string; description: string | null },
  count: number
): Promise<Prisma.ProductGetPayload<{}>[]> {
  const generatedProducts = await generateProducts(organization, count)
  
  return Promise.all(
    generatedProducts.map(async (product) => {
      try {
        return await prisma.product.create({
          data: {
            ...product,
            organizationId: organization.id,
            name: product.name!,
            price: product.price!,
            currency: product.currency!
          }
        })
      } catch (error) {
        console.error(`Error saving product ${product.name}:`, error)
        throw error
      }
    })
  )
}

// Helper function to generate and save services
async function generateAndSaveServices(
  organization: { id: string; name: string; description: string | null },
  count: number
): Promise<Prisma.ServiceGetPayload<{}>[]> {
  const generatedServices = await generateServices(organization, count)
  
  return Promise.all(
    generatedServices.map(async (service) => {
      try {
        return await prisma.service.create({
          data: {
            ...service,
            organizationId: organization.id,
            name: service.name!,
            price: service.price!,
            currency: service.currency!
          }
        })
      } catch (error) {
        console.error(`Error saving service ${service.name}:`, error)
        throw error
      }
    })
  )
}

// Helper function to generate and save partnerships
async function generateAndSavePartnerships(
  organization: { id: string; name: string; description: string | null },
  count: number
): Promise<Prisma.PartnershipGetPayload<{}>[]> {
  const generatedPartnerships = await generatePartnerships(organization, count)
  
  return Promise.all(
    generatedPartnerships.map(async (partnership) => {
      try {
        return await prisma.partnership.create({
          data: {
            ...partnership,
            organizationId: organization.id,
            partnerName: partnership.partnerName!,
            startDate: partnership.startDate!
          }
        })
      } catch (error) {
        console.error(`Error saving partnership ${partnership.partnerName}:`, error)
        throw error
      }
    })
  )
}

// Main query function
export async function getOrganizationRelationships(
  organizationId: string,
  limit = 10
): Promise<OrganizationRelationships> {
  const organization = await prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { name: true, description: true }
  })

  // Get existing relationships
  const [
    existingMembers,
    existingProducts,
    existingServices,
    existingPartnerships,
    globalProblems,
    globalSolutions,
    totals
  ] = await Promise.all([
    prisma.organizationMembership.findMany({
      where: { organizationId },
      include: { person: true },
      take: limit
    }),
    prisma.product.findMany({
      where: { organizationId },
      take: limit
    }),
    prisma.service.findMany({
      where: { organizationId },
      take: limit
    }),
    prisma.partnership.findMany({
      where: { organizationId },
      take: limit
    }),
    prisma.organizationGlobalProblem.findMany({
      where: { organizationId },
      include: { globalProblem: true },
      take: limit
    }),
    prisma.organizationGlobalSolution.findMany({
      where: { organizationId },
      include: { globalSolution: true },
      take: limit
    }),
    Promise.all([
      prisma.organizationMembership.count({ where: { organizationId } }),
      prisma.product.count({ where: { organizationId } }),
      prisma.service.count({ where: { organizationId } }),
      prisma.partnership.count({ where: { organizationId } }),
      prisma.organizationGlobalProblem.count({ where: { organizationId } }),
      prisma.organizationGlobalSolution.count({ where: { organizationId } })
    ])
  ])

  // Generate more if needed
  const [
    newMembers,
    newProducts,
    newServices,
    newPartnerships
  ] = await Promise.all([
    existingMembers.length < limit ? generateAndSaveMembers({ id: organizationId, ...organization }, limit - existingMembers.length) : [],
    existingProducts.length < limit ? generateAndSaveProducts({ id: organizationId, ...organization }, limit - existingProducts.length) : [],
    existingServices.length < limit ? generateAndSaveServices({ id: organizationId, ...organization }, limit - existingServices.length) : [],
    existingPartnerships.length < limit ? generateAndSavePartnerships({ id: organizationId, ...organization }, limit - existingPartnerships.length) : []
  ])

  return {
    members: [...existingMembers, ...newMembers],
    products: [...existingProducts, ...newProducts],
    services: [...existingServices, ...newServices],
    partnerships: [...existingPartnerships, ...newPartnerships],
    globalProblems: globalProblems,
    globalSolutions: globalSolutions,
    total: {
      members: totals[0],
      products: totals[1],
      services: totals[2],
      partnerships: totals[3],
      globalProblems: totals[4],
      globalSolutions: totals[5]
    }
  }
} 