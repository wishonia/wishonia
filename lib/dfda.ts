import { Account } from "@prisma/client"

import { UserVariable } from "@/types/models/UserVariable"
import { prisma } from "@/lib/db"

async function getYourUser(yourUserId: any) {
  let user = await prisma.user.findUnique({
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
export async function getOrCreateDfdaUser(yourUserId: any): Promise<Account> {
  let your_user = await getYourUser(yourUserId)
  let provider = "dfda"
  if (your_user) {
    const account = await prisma.account.findFirst({
      where: {
        userId: yourUserId,
        provider: provider,
      },
    })
    if (account) {
      return account
    }
  }

  let response = await fetch(`https://safe.dfda.earth/api/v1/user`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-Client-ID": process.env.DFDA_CLIENT_ID!,
      "X-Client-Secret": process.env.DFDA_CLIENT_SECRET!,
    },
    body: JSON.stringify({
      clientUserId: yourUserId,
    }),
  })
  let jsonResponse = await response.json()
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

export async function getOrCreateDfdaAccessToken(yourUserId: any) {
  const account = await getOrCreateDfdaUser(yourUserId)
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
