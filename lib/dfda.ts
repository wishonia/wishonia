import { Account, User } from "@prisma/client"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"
import { prisma } from "@/lib/db"

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

  console.log("🔑 Creating DFDA user for:", yourUserId)
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
  const dfdaUrl = `https://safe.dfda.earth/api/v3/${path}?${dfdaParams}`
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

  console.log(`Making ${method} request to ${dfdaUrl}`)
  const response = await fetch(dfdaUrl, init)
  if (!response.ok) {
    console.error(`DFDA API Error: ${response.status} ${response.statusText}`)
    console.error("URL:", dfdaUrl)
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
  return dfdaFetch(
    "GET",
    path,
    urlParams,
    undefined,
    yourUserId,
    additionalHeaders
  )
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
      if (!isNaN(numericId)) {
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

export async function getDfdaRedirectUrl(
  userId: string
): Promise<string | null> {
  const dfdaToken = await getDfdaAccessTokenIfExists(userId)
  const baseUrl = "https://safe.dfda.earth/app/public/#/app"
  if (dfdaToken) {
    return `${baseUrl}|/reminders-inbox?access_token=${dfdaToken}`
  } else {
    const newToken = await getOrCreateDfdaAccessToken(userId)
    return `${baseUrl}/intro?access_token=${newToken}`
  }
}
