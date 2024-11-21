"use server"

import { ListStudiesRequest, StudiesApi } from "../lib/clinical-trials-gov"
import { Configuration } from "../lib/clinical-trials-gov/runtime"

// Create API client with custom configuration to intercept and log requests
const config = new Configuration({
  basePath: "https://clinicaltrials.gov/api/v2",
  headers: {
    Accept: "application/json",
  },
  middleware: [
    {
      pre: async (context: any) => {
        console.log("Full API URL:", context.url)
        console.log("API Headers:", context.init.headers)
        console.log(
          "API Query Parameters:",
          new URL(context.url).searchParams.toString()
        )
        return context
      },
      post: async (context: any) => {
        // Log response status and headers
        console.log("Response Status:", context.response.status)
        console.log(
          "Response Headers:",
          Object.fromEntries(context.response.headers.entries())
        )

        // Try to get response body
        try {
          const clone = context.response.clone()
          const text = await clone.text()
          console.log("Response Body:", text)
        } catch (e) {
          console.log("Could not read response body:", e)
        }

        return context
      },
    },
  ],
})

// TODO: Fix this
const studiesApi = new StudiesApi(config)

// Define the type for the parameters we actually use
export type TrialSearchParams = Pick<
  ListStudiesRequest,
  | "queryCond"
  | "queryTerm"
  | "queryIntr"
  | "queryTitles"
  | "queryOutc"
  | "querySpons"
  | "queryLead"
  | "queryId"
  | "filterGeo"
  | "filterAdvanced"
  | "pageToken"
  | "filterOverallStatus"
>

const DEFAULT_FIELDS = [
  "NCTId",
  "BriefTitle",
  "BriefSummary",
  "Phase",
  "OverallStatus",
  "StartDate",
  "PrimaryCompletionDate",
  "CompletionDate",
  "StudyFirstPostDate",
  "ResultsFirstPostDate",
  "LastUpdatePostDate",
  "StudyType",
  "LeadSponsorName",
  "LocationFacility",
  "LocationCity",
  "LocationState",
  "LocationZip",
  "LocationCountry",
  "LocationStatus",
  "LocationGeoPoint",
  "InterventionName",
  "InterventionType",
]

export async function searchTrials(params: TrialSearchParams) {
  try {
    console.log("Received search params:", params)

    // Build the query parameters
    const queryParams = new URLSearchParams()
    queryParams.set("format", "json")

    // Add condition search - no quotes needed
    if (params.queryCond) {
      queryParams.set("query.cond", params.queryCond.trim())
    }

    // Add fields
    if (DEFAULT_FIELDS.length) {
      queryParams.set("fields", DEFAULT_FIELDS.join("|"))
    }

    // Add pagination
    queryParams.set("pageSize", "10")
    queryParams.set("countTotal", "true")

    // Add other parameters if they exist
    if (params.queryTerm) queryParams.set("query.term", params.queryTerm)
    if (params.queryIntr) queryParams.set("query.intr", params.queryIntr)
    if (params.queryTitles) queryParams.set("query.titles", params.queryTitles)
    if (params.queryOutc) queryParams.set("query.outc", params.queryOutc)
    if (params.querySpons) queryParams.set("query.spons", params.querySpons)
    if (params.queryLead) queryParams.set("query.lead", params.queryLead)
    if (params.queryId) queryParams.set("query.id", params.queryId)
    if (params.filterGeo) queryParams.set("filter.geo", params.filterGeo)
    if (params.filterAdvanced)
      queryParams.set("filter.advanced", params.filterAdvanced)
    if (params.pageToken) queryParams.set("pageToken", params.pageToken)

    // Fix: Use filter.overallStatus instead of filterOverallStatus
    if (params.filterOverallStatus) {
      const statusValue = Array.isArray(params.filterOverallStatus)
        ? params.filterOverallStatus.join("|")
        : params.filterOverallStatus
      queryParams.set("filter.overallStatus", statusValue)
    }

    console.log(
      "Making API request with params:",
      Object.fromEntries(queryParams.entries())
    )

    try {
      const response = await fetch(
        `${config.basePath}/studies?${queryParams.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
          next: {
            revalidate: 60, // Cache for 1 minute
          },
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}\n${errorText}`
        )
      }

      const data = await response.json()
      console.log("API Response:", {
        totalCount: data.totalCount,
        hasStudies: Boolean(data.studies),
        studiesCount: data.studies?.length,
      })

      return {
        studies: data.studies || [],
        totalCount: data.totalCount || 0,
        nextPageToken: data.nextPageToken,
      }
    } catch (apiError: any) {
      console.error("API Error:", apiError)
      throw new Error(apiError.message || "Failed to fetch trials")
    }
  } catch (error) {
    console.error("Error in searchTrials:", error)
    if (error instanceof Error) {
      console.error("Error stack:", error.stack)
    }
    throw error
  }
}
