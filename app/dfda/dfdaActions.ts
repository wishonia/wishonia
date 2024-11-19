"use server"

import {Effectiveness} from "@prisma/client"
import {authOptions} from "@/lib/auth"

import {prisma} from "@/lib/db"
import {findArticleByTopic, writeArticle} from "@/lib/agents/researcher/researcher";
import {dfdaGET, getOrCreateDfdaAccessToken} from '@/lib/dfda'
import {getServerSession} from 'next-auth/next'

export async function getSafeUrlWithToken(url: string) {
  if(!url.includes('https')) {
    //remove leading slash if it exists
    url = url.startsWith('/') ? url.slice(1) : url;
    url = 'https://safe.dfda.earth/app/public/#/app/' + url;
  }
  const token = await getDfdaAccessToken();
  return `${url}?access_token=${token}`;
}

export async function getDfdaAccessToken() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    console.log('No user ID found in session:', session)
    return null
  }
  
  try {
    return await getOrCreateDfdaAccessToken(session.user.id)
  } catch (error) {
    console.error('Error getting DFDA access token:', error)
    return null
  }
} 

export async function fetchConditions() {
  return prisma.dfdaCondition.findMany()
}

export async function addTreatment(
  userId: string,
  conditionName: string,
  treatmentName: string,
  effectiveness: Effectiveness
) {
  const treatment = await prisma.dfdaTreatment.findUnique({
    where: {
      name: treatmentName,
    },
  })

  if (!treatment) {
    throw new Error("Treatment not found")
  }

  const condition = await prisma.dfdaCondition.findUnique({
    where: {
      name: conditionName,
    },
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
      tried: true, // Add this line
    },
  })

  return userTreatment
}

export async function updateTreatmentReport(
  userId: string,
  conditionName: string,
  treatmentName: string,
  effectiveness: Effectiveness
) {
  const treatment = await prisma.dfdaTreatment.findUnique({
    where: {
      name: treatmentName,
    },
  })

  if (!treatment) {
    throw new Error("Treatment not found")
  }

  const condition = await prisma.dfdaCondition.findUnique({
    where: {
      name: conditionName,
    },
  })

  if (!condition) {
    throw new Error("Condition not found")
  }

  const userTreatment = await prisma.dfdaUserTreatmentReport.update({
    where: {
      userId_treatmentId_conditionId: {
        userId,
        conditionId: condition.id,
        treatmentId: treatment.id,
      },
    },
    data: {
      effectiveness,
    },
  })

  return userTreatment
}

export async function searchTreatmentsAndConditions(query: string) {
  const treatments = await prisma.dfdaTreatment.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      featuredImage: true,
    },
    take: 5,
  })

  const conditions = await prisma.dfdaCondition.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
    take: 5,
  })

  return [
    ...treatments.map((t) => ({ ...t, type: "treatment" })),
    ...conditions.map((c) => ({ ...c, type: "condition" })),
  ]
}

export async function getConditionByName(name: string) {
    return prisma.dfdaCondition.findFirst({
        where: {
            name: {
                equals: name,
                mode: 'insensitive'
            }
        },
        include: {
            conditionTreatments: {
                where: {
                    popularity: {
                        gt: 10
                    }
                },
                include: {
                    treatment: true,
                },
                orderBy: [{popularity: "desc"}, {averageEffect: "desc"}],
            },
        },
    });
}

export async function getMetaAnalysis(treatmentName: string, conditionName: string) {
  const topic = `Meta-analysis on the safety and effectiveness of ${treatmentName} for ${conditionName}`;
  const article = await findArticleByTopic(topic);

  if(article) {
    return article;
  }

    return writeArticle(topic, "test-user");
}

export const getDataSources = async (): Promise<any> => {
  return dfdaGET('connectors/list', { final_callback_url: window.location.href })
}