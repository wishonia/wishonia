"use server"

import { Account, Effectiveness, User } from "@prisma/client"
import { getMarkdownFiles } from "@/lib/markdown/get-markdown-files"
import type { ProcessedMarkdownFile } from "@/lib/markdown/get-markdown-files"

import type { GetStudiesResponse } from "@/types/models/GetStudiesResponse"
import { GetTrackingReminderNotificationsResponse } from "@/types/models/GetTrackingReminderNotificationsResponse"
import { GlobalVariable } from "@/types/models/GlobalVariable"
import { TrackingReminderNotification } from "@/types/models/TrackingReminderNotification"
import { UserVariable } from "@/types/models/UserVariable"
import {
  findArticleByTopic,
  writeArticle,
} from "@/lib/agents/researcher/researcher"
import { prisma } from "@/lib/db"

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

async function getYourUser(yourUserId: string): Promise<User | null> {
  if (!yourUserId) {
    throw new Error("User ID is required")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: yourUserId,
    },
  })
  if (user) {
    return user
  }
  return prisma.user.create({
    data: {
      id: yourUserId,
    },
  })
}

// Function to get or create a user
export async function getOrCreateDfdaUser(
  yourUserId: string
): Promise<Account> {
  if (!yourUserId || yourUserId.trim() === "") {
    throw new Error("Valid user ID string is required")
  }

  const your_user = await getYourUser(yourUserId)
  const provider = "dfda"

  if (!your_user) {
    throw new Error("Failed to get or create user")
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      userId: yourUserId,
      provider: provider,
    },
  })

  if (existingAccount) {
    return existingAccount
  }

  // Validate required environment variables
  if (!process.env.DFDA_CLIENT_ID || !process.env.DFDA_CLIENT_SECRET) {
    throw new Error("DFDA client credentials are not configured")
  }

  console.log("🔑 Creating DFDA user.")
  const response = await fetch(`https://safe.dfda.earth/api/v1/user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-Client-ID": process.env.DFDA_CLIENT_ID,
      "X-Client-Secret": process.env.DFDA_CLIENT_SECRET,
    },
    body: JSON.stringify({
      clientUserId: yourUserId,
      clientId: process.env.DFDA_CLIENT_ID, // TODO: Make this unnecessary
    }),
  })
  console.log(
    "🔍 Creating DFDA user API Response Status:",
    response.status,
    response.statusText
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create DFDA user: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  const jsonResponse = await response.json()
  if (!jsonResponse.user || !jsonResponse.user.id) {
    throw new Error("Invalid response from DFDA API")
  }

  const dfdaUser = jsonResponse.user
  const providerAccountId = dfdaUser.id.toString()
  const expiresAt = new Date(dfdaUser.accessTokenExpires).getTime() / 1000
  return prisma.account.create({
    data: {
      provider: provider,
      providerAccountId: providerAccountId,
      scope: dfdaUser.scope,
      access_token: dfdaUser.accessToken,
      refresh_token: dfdaUser.refreshToken,
      expires_at: expiresAt,
      type: "oauth",
      user: { connect: { id: yourUserId } },
    },
  })
}

export async function getDfdaAccessTokenIfExists(
  yourUserId: string
): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId: yourUserId,
      provider: "dfda",
    },
  })
  return account && account.access_token ? account.access_token : null
}

export async function getOrCreateDfdaAccessToken(
  yourUserId: string
): Promise<string> {
  //return "demo"
  if (!yourUserId) {
    throw new Error("User ID is required")
  }

  const account = await getOrCreateDfdaUser(yourUserId)
  if (!account.access_token) {
    throw new Error("No access token available")
  }
  return account.access_token
}

export async function getUserVariable(
  variableId: number,
  params?: any
): Promise<UserVariable> {
  let path = `/api/dfda/userVariables?variableId=${variableId}`
  if (params) {
    path += `?${new URLSearchParams(params).toString()}`
  }
  let response = await fetch(path)
  let jsonResponse = await response.json()
  return jsonResponse[0]
}

export async function getGlobalVariable(
  variableId: number
): Promise<GlobalVariable> {
  return await dfdaGET(`variables/${variableId}`)
}

export async function getUserVariableWithCharts(
  variableId: number
): Promise<UserVariable> {
  return await getUserVariable(variableId, { includeCharts: true })
}

async function dfdaFetch(
  method: "GET" | "POST",
  path: string,
  urlParams?: Record<string, string>,
  body?: any,
  yourUserId?: string,
  additionalHeaders?: Record<string, string>
) {
  const dfdaParams = new URLSearchParams(urlParams)
  const dfdaApiUrl = `https://safe.dfda.earth/api/v3/${path}?${dfdaParams}`
  const headers: HeadersInit = {
    accept: "application/json",
    "Content-Type": method === "POST" ? "application/json" : "",
    ...additionalHeaders,
  }

  if (yourUserId) {
    headers["Authorization"] =
      `Bearer ${await getOrCreateDfdaAccessToken(yourUserId)}`
  }

  const init: RequestInit = {
    method: method,
    headers,
    credentials: "include",
  }

  if (method === "POST" && body) {
    init.body = JSON.stringify(body)
  }

  console.log(`Making ${method} request to ${dfdaApiUrl}`)
  const response = await fetch(dfdaApiUrl, init)
  if (!response.ok) {
    console.error(`DFDA API Error: ${response.status} ${response.statusText}`)
    console.error("URL:", dfdaApiUrl)
    const errorText = await response.text()
    console.error("Response:", errorText)
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const json = await response.json()
  if (json.error) {
    console.error("Error in dfdaFetch to ${dfdaUrl}", json.error)
  }
  return json
}

export async function dfdaGET(
  path: string,
  urlParams?: Record<string, string>,
  yourUserId?: string,
  additionalHeaders?: Record<string, string>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('📡 dfdaGET Request:', {
    path,
    urlParams,
  })

  const result = await dfdaFetch(
    "GET",
    path,
    urlParams,
    undefined,
    yourUserId,
    additionalHeaders
  )

  console.log('✅ dfdaGET Response:', {
    path,
    responseStatus: 'success',
  })

  return result
}

export async function dfdaPOST(
  path: string,
  body?: any,
  yourUserId?: string,
  urlParams?: Record<string, string>,
  additionalHeaders?: Record<string, string>
) {
  return dfdaFetch("POST", path, urlParams, body, yourUserId, additionalHeaders)
}

export async function postMeasurements(measurements: any, yourUserId: any) {
  return dfdaPOST("measurements", measurements, yourUserId)
}

export async function searchGlobalVariables(
  name: string,
  limit: number = 10
): Promise<GlobalVariable[]> {
  return await dfdaGET("variables", {
    name,
    limit: limit.toString(),
  })
}

export async function searchUserVariables(
  name: string,
  limit: number = 10
): Promise<UserVariable[]> {
  return await dfdaGET("userVariables", {
    name,
    limit: limit.toString(),
  })
}

export async function getVariable(params: {
  id?: number | string
  name?: string
  type?: "global" | "user"
}): Promise<GlobalVariable | UserVariable | undefined> {
  const { id, name, type = "user" } = params

  try {
    // If ID is provided, use direct fetch methods
    if (id) {
      const numericId = typeof id === "string" ? parseInt(id) : id
      if (!Number.isNaN(numericId)) {
        return type === "global"
          ? await getGlobalVariable(numericId)
          : await getUserVariable(numericId)
      }
    }

    // If name is provided, use search methods
    if (name) {
      const results =
        type === "global"
          ? await searchGlobalVariables(name, 1)
          : await searchUserVariables(name, 1)
      return results?.[0]
    }

    return undefined
  } catch (error) {
    console.error(`Error fetching ${type} variable:`, error)
    return undefined
  }
}

export async function createDfdaApplication(
  name: string,
  description: string,
  redirectUri: string
): Promise<string> {
  const response = await dfdaPOST("apps/create", {
    appDisplayName: name,
    appDescription: description,
    homepageUrl: redirectUri,
    qmClientId: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  })
  const data = response
  return data.clientId || data.qmClientId
}

function getDFDAClientId(): string {
  if (!process.env.DFDA_CLIENT_ID) {
    throw new Error("DFDA_CLIENT_ID is not set")
  }
  return process.env.DFDA_CLIENT_ID
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
export async function searchDfdaVariables(
  searchPhrase?: string,
  additionalParams: Record<string, string> = {}
): Promise<GlobalVariable[]> {
  try {
    const baseUrl = "https://safe.fdai.earth/api/v3/variables"
    const params = new URLSearchParams({
      appName: "Wishonia",
      clientId: getDFDAClientId(),
      limit: "10",
      includePublic: "true",
      ...(searchPhrase ? { searchPhrase } : {}),
      ...additionalParams,
    })

    const url = `${baseUrl}?${params.toString()}`
    console.log(`Fetching from URL: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(
        `HTTP error! status: ${response.status}, statusText: ${response.statusText}, body: ${errorBody}`
      )
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      console.error(
        "Unexpected response structure:",
        JSON.stringify(data, null, 2)
      )
      throw new Error(
        "Unexpected response format: 'data' field is missing or not an array"
      )
    }

    const variables = data

    console.log(`Found ${variables.length} variables`)
    return variables
  } catch (error) {
    console.error("Error in searchDfdaVariables:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    throw new Error(
      `Failed to search DFDA variables: ${error instanceof Error ? error.message : "Unknown error"}`
    )
  }
}
export async function getSafeRedirectUrl(
  userId: string,
  path?: string
): Promise<string | null> {
  const dfdaToken = await getDfdaAccessTokenIfExists(userId)
  const baseUrl = "https://safe.dfda.earth/app/public/#/app"
  if (dfdaToken) {
    if (!path) {
      path = "/reminders-inbox"
    }
    if (!path.startsWith("/")) {
      path = "/" + path
    }
    return `${baseUrl}${path}?access_token=${dfdaToken}`
  } else {
    const newToken = await getOrCreateDfdaAccessToken(userId)
    return `${baseUrl}/intro?access_token=${newToken}`
  }
}


export async function createStudy(causeVariableName: string,
  effectVariableName: string,
   type: string,
   userId: string
  ) {
  return dfdaPOST("study/create", {
    causeVariableName,
    effectVariableName,
    type,
  }, userId)
}

export async function getStudies(limit: number = 10) {
  return dfdaGET(`studies`, { limit: limit.toString() })
}

export async function getStudy(studyId: string, userId?: string) {
  console.log('🔍 Fetching study with ID:', studyId)
  try {
    const response = await dfdaGET(`study`, {
      studyId,
      includeCharts: "true",
    }, userId)
    //console.log('📊 Study response:', JSON.stringify(response, null, 2))
    // check if charts are included
    const study = response
    if (!study.studyCharts) {
      throw new Error('Study charts not found')
      debugger
    }
    return study
  } catch (error) {
    console.error('❌ Error fetching study:', {
      studyId,
      error: error instanceof Error ? error.message : 'Unknown error',
      fullError: error
    })
    throw error
  }
}