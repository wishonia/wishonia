import {LanguageModelV1} from "@ai-sdk/provider";
import {Organization, Prisma} from "@prisma/client";
import { PrismaClient } from '@prisma/client';
import {generateObject} from "ai";
import {z} from "zod";

const prisma = new PrismaClient();
import {findOrCreateArticleByPromptedTopic, WriteArticleOptions} from "@/lib/agents/researcher/researcher";
import {getModel} from "@/lib/utils/modelUtils";
import {normalizeUrl} from "@/lib/utils/urlUtils";

const OrganizationSchema = z.object({
    name: z.string().describe("The official name of the organization"),
    alternateName: z
        .string()
        .optional()
        .describe("An alternative name for the organization, if applicable"),
    description: z
        .string()
        .optional()
        .describe(
            "A brief description of the organization's purpose or activities"
        ),
    url: z
        .string()
        //.url()  // Commented out because the URL might not be a valid URL
        .optional()
        .describe("The official website URL of the organization"),
    logo: z
        .string()
        // .url()  // Commented out because the logo URL might not be a valid URL
        .optional()
        .describe("URL of the organization's logo image"),
    email: z
        .string()
        .optional()
        .describe("The primary contact email address for the organization"),
    telephone: z
        .string()
        .optional()
        .describe("The main contact telephone number for the organization"),
    skills: z
        .array(z.string())
        .optional()
        .describe(
            "An array of skills or areas of expertise associated with the organization"
        ),
})

export async function getOrCreateOrganizationFromUrl(
    url: string,
    userId: string,
    writeArticleOptions: WriteArticleOptions = {}
): Promise<Organization> {
    // Make sure trailing slashes are removed from the URL
    url = normalizeUrl(url)
    // Step 1: Try to find the organization in the database
    const existingOrganization = await prisma.organization.findFirst({
        where: {
            url: url,
        },
    })

    // If the organization exists, return it
    if (existingOrganization) {
        console.log("Organization found in database:", existingOrganization.id)
        return existingOrganization
    }

    // If the organization doesn't exist, generate and create it
    console.log(`🔍 Organization ${url} not found in database. 
🌱 Generating new organization profile from URL...`)
    return generateOrganizationFromUrlBySearch(url, userId, writeArticleOptions)
}

export async function generateOrganizationFromUrlBySearch(
    url: string,
    userId: string,
    writeArticleOptions: WriteArticleOptions = {}
): Promise<Organization> {
    // Make sure trailing slashes are removed from the URL
    url = normalizeUrl(url)
    // Step 1: Generate an article about the organization
    const article = await findOrCreateArticleByPromptedTopic(url, userId, {
        numberOfWebResultsToInclude: 1, // Only use the top search result,
        // or we get random other stuff
        purpose:
            "obtain contact information and company details for the provided URL",
        format: "article",
        wordLimit: 1000,
        includeSummary: true,
        ...writeArticleOptions, // Merge custom options
    })

    // Step 2: Use the generated article to extract organization information
    const model = getModel(writeArticleOptions.modelName)

    const prompt = `
    Based on the following article about an organization, 
    extract the relevant information to create an organization record. 
    The information should include the organization's name, 
    alternate name (if any), description, URL, logo URL (if mentioned), email, telephone number,
    and an array of skills or areas of expertise associated with the organization.

    Article:
    ${article.content}

    Please provide the information in a structured format that can be parsed as a valid JavaScript object.
    Include a 'skills' property with an array of strings representing the organization's key skills or areas of expertise.
  `

    return await generateAndSaveOrganization(model, prompt, url)
}

async function generateAndSaveOrganization(
    model: LanguageModelV1,
    prompt: string,
    url: string
) {
    console.log(`🏢 Extracting organization details from ${url} ✨`)
    const result =
        await generateObject({
        model: model,
        schema: OrganizationSchema,
        prompt,
    })

    let organization = result.object as
        Organization & { skills?: string[] }

    // Clean up and validate the data
    organization = {
        ...organization,
        url: normalizeUrl(url), // Sometimes the LLM returns a different URL
        email: organization.email === "<UNKNOWN>" || organization.email === "" ? null : organization.email,
        telephone: organization.telephone === "<UNKNOWN>" || organization.telephone === "" ? null : organization.telephone,
        logo: organization.logo === "<UNKNOWN>" || organization.logo === "" || !isValidUrl(organization.logo) ? null : organization.logo,
    }

    // Extract skills before saving the organization
    const skills = organization.skills || []
    delete organization.skills
    if (!organization.url) {
        throw new Error("Organization URL is required")
    }

    if(!organization.slug) {
        // WP style slug from name
        organization.slug = organization.name.toLowerCase().replace(/ /g, "-")
    }

    try {
        // Save the organization to the database
        const savedOrganization = await prisma.organization.create({
            data: {
                ...organization,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log(
            "Organization generated and saved successfully!",
            savedOrganization.id
        );

        // Create OrganizationSkill relations
        if (skills.length > 0) {
            await Promise.all(
                skills.map(async (skillName) => {
                    const skill = await prisma.skill.upsert({
                        where: {name: skillName},
                        update: {},
                        create: {name: skillName},
                    })
                    return prisma.organizationSkill.create({
                        data: {
                            organizationId: savedOrganization.id,
                            skillId: skill.id,
                        },
                    })
                })
            )
        }

        return savedOrganization;
    } catch (error) {
        debugger
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                console.error('Unique constraint violation:', {
                    fields: error.meta?.target,
                    attemptedValues: {
                        name: organization.name,
                        url: organization.url,
                        email: organization.email,
                        telephone: organization.telephone,
                    }
                });
            }
        }
        console.error('Error saving organization:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function generateOrganizationFromUrl(
    url: string
): Promise<Organization> {
    const model = getModel("gpt-4o")

    // const perplexity = createOpenAI({
    //   name: 'perplexity',
    //   apiKey: process.env.PERPLEXITY_API_KEY ?? '',
    //   baseURL: 'https://api.perplexity.ai/',
    // });
    // model = perplexity('llama-3.1-sonar-large-128k-online');

    const prompt = `
    Please analyze the following URL and generate information about the organization it represents:
    
    URL: ${url}
    
    Extract and provide the following details:
    1. Organization name
    2. Alternate name (if any)
    3. Brief description of the organization
    4. Official website URL
    5. Logo URL (if easily findable)
    6. Contact email (if available)
    7. Contact telephone number (if available)

    If you can't find specific information, use null or an empty string as appropriate.
    Provide the information in a structured format that matches the OrganizationSchema.
  `

    // const { text } = await generateText({
    //   model,
    //   prompt,
    // });

    return await generateAndSaveOrganization(model, prompt, url)
}

function isValidUrl(url?: string | null | undefined): boolean {
    if (!url) return false
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
