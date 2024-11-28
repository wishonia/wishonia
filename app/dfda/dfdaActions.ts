"use server"

import { Effectiveness } from "@prisma/client"
import { getMarkdownFiles } from "@/lib/markdown/get-markdown-files"
import type { ProcessedMarkdownFile } from "@/lib/markdown/get-markdown-files"

import type { GetStudiesResponse } from "@/types/models/GetStudiesResponse"
import { GetTrackingReminderNotificationsResponse } from "@/types/models/GetTrackingReminderNotificationsResponse"
import { TrackingReminderNotification } from "@/types/models/TrackingReminderNotification"
import {
  findArticleByTopic,
  writeArticle,
} from "@/lib/agents/researcher/researcher"
import { prisma } from "@/lib/db"
import { dfdaGET, dfdaPOST } from "@/lib/dfda"

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
        mode: "insensitive",
      },
    },
    include: {
      conditionTreatments: {
        where: {
          popularity: {
            gt: 10,
          },
        },
        include: {
          treatment: true,
        },
        orderBy: [{ popularity: "desc" }, { averageEffect: "desc" }],
      },
    },
  })
}

export async function getMetaAnalysis(
  treatmentName: string,
  conditionName: string
) {
  if (!treatmentName?.trim() || !conditionName?.trim()) {
    throw new Error("Treatment name and condition name are required")
  }

  const topic = `Meta-analysis on the safety and effectiveness of ${treatmentName} for ${conditionName}`

  try {
    const article = await findArticleByTopic(topic)
    if (article) {
      return article
    }
    return writeArticle(topic, "test-user")
  } catch (error) {
    console.error("Failed to generate meta-analysis:", error)
    throw new Error("Failed to generate meta-analysis. Please try again later.")
  }
}

export const getDataSources = async (
  final_callback_url: string
): Promise<any> => {
  return dfdaGET("connectors/list", {
    final_callback_url,
  })
}

export type SortParam =
  | "-qmScore"
  | "correlationCoefficient"
  | "-correlationCoefficient"
  | "-numberOfUsers"
  | "pValue"

export async function searchPredictors(params: {
  query?: string
  sort?: SortParam
  limit?: number
  offset?: number
  effectVariableName?: string
  causeVariableName?: string
  correlationCoefficient?: string
}) {
  try {
    const apiParams: Record<string, string> = {
      limit: (params.limit || 10).toString(),
      offset: (params.offset || 0).toString(),
    }

    if (params.effectVariableName) {
      apiParams.effectVariableName = params.effectVariableName
    }

    if (params.sort) {
      apiParams.sort = params.sort
    }

    if (params.correlationCoefficient) {
      apiParams.correlationCoefficient = params.correlationCoefficient
    }

    const response = (await dfdaGET("studies", apiParams)) as GetStudiesResponse

    return response.studies || []
  } catch (error) {
    console.error("Error searching studies:", error)
    throw new Error("Failed to search studies")
  }
}

export async function searchVariables(searchPhrase: string) {
  try {
    const results = await dfdaGET("variables", {
      includePublic: "true",
      fallbackToAggregatedCorrelations: "true",
      numberOfCorrelationsAsEffect: "(gt)1",
      sort: "-numberOfCorrelationsAsEffect",
      outcome: "true",
      limit: "10",
      searchPhrase,
    })
    return results
  } catch (error) {
    console.error("Error searching variables:", error)
    throw new Error("Failed to search variables")
  }
}

export async function joinStudy(studyId: string, userId: string) {
  console.log("Starting joinStudy with:", { studyId, userId })

  if (!studyId) {
    throw new Error("Study ID is required")
  }

  if (!userId) {
    console.error("Missing userId in session:", userId)
    throw new Error("User ID is required")
  }

  try {
    console.log("Making POST request to join study with params:", {
      studyId,
      clientId: process.env.DFDA_CLIENT_ID,
    })

    const response = await dfdaPOST(
      "study/join",
      {
        studyId,
        clientId: process.env.DFDA_CLIENT_ID,
      },
      userId
    )

    console.log("Join study response:", response)

    // Return the URL instead of redirecting
    return "/dfda/inbox"
  } catch (error) {
    console.error("Error joining study:", {
      studyId,
      clientId: getDFDAClientId(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })
    throw new Error("Failed to join study")
  }
}

function getDFDAClientId(): string {
  if (!process.env.DFDA_CLIENT_ID) {
    throw new Error("DFDA_CLIENT_ID is not set")
  }
  return process.env.DFDA_CLIENT_ID
}

export async function getTrackingReminderNotifications(
  userId: string
): Promise<TrackingReminderNotification[]> {
  try {
    const response = (await dfdaGET(
      "trackingReminderNotifications",
      { clientId: getDFDAClientId() },
      userId
    )) as GetTrackingReminderNotificationsResponse

    if (!response.data) {
      console.log("No notifications in response:", response)
      return []
    }

    return response.data
  } catch (error) {
    console.error("Error fetching tracking reminder notifications:", error)
    throw new Error("Failed to fetch notifications")
  }
}

export async function trackNotification(
  notification: TrackingReminderNotification,
  ourUserId: string,
  value?: number
) {
  try {
    const response = await dfdaPOST(
      "trackingReminderNotifications/track",
      {
        id: notification.id,
        modifiedValue: value !== undefined ? value : notification.modifiedValue,
      },
      ourUserId // Pass our userId for auth
    )
    return response
  } catch (error) {
    console.error("Error tracking notification:", error)
    throw new Error("Failed to track notification")
  }
}

export async function skipNotification(
  notification: TrackingReminderNotification,
  ourUserId: string
) {
  try {
    const response = await dfdaPOST(
      "trackingReminderNotifications/skip",
      { id: notification.id },
      ourUserId // Pass our userId for auth
    )
    return response
  } catch (error) {
    console.error("Error skipping notification:", error)
    throw new Error("Failed to skip notification")
  }
}

export async function snoozeNotification(
  notification: TrackingReminderNotification,
  ourUserId: string
) {
  try {
    const response = await dfdaPOST(
      "trackingReminderNotifications/snooze",
      { id: notification.id },
      ourUserId // Pass our userId for auth
    )
    return response
  } catch (error) {
    console.error("Error snoozing notification:", error)
    throw new Error("Failed to snooze notification")
  }
}

export async function trackAllNotifications(
  notification: TrackingReminderNotification,
  ourUserId: string,
  value: number
) {
  try {
    const response = await dfdaPOST(
      "trackingReminderNotifications/trackAll",
      {
        variableId: notification.variableId,
        modifiedValue: value,
      },
      ourUserId // Pass our userId for auth
    )
    return response
  } catch (error) {
    console.error("Error tracking all notifications:", error)
    throw new Error("Failed to track all notifications")
  }
}

export async function skipAllNotifications(
  notification: TrackingReminderNotification,
  ourUserId: string
) {
  try {
    const response = await dfdaPOST(
      "trackingReminderNotifications/skipAll",
      { variableId: notification.variableId },
      ourUserId // Pass our userId for auth
    )
    return response
  } catch (error) {
    console.error("Error skipping all notifications:", error)
    throw new Error("Failed to skip all notifications")
  }
}

export async function getProblems(): Promise<ProcessedMarkdownFile[]> {
  return getMarkdownFiles("public/globalSolutions/dfda/problems")
}