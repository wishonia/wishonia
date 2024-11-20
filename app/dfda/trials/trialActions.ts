'use server'

const BASE_URL = 'https://clinicaltrials.gov/api/v2/studies'

const DEFAULT_FIELDS = [
  'NCTId',
  'BriefTitle',
  'BriefSummary',
  'Phase',
  'OverallStatus',
  'StartDate',
  'PrimaryCompletionDate',
  'CompletionDate',
  'StudyFirstPostDate',
  'ResultsFirstPostDate',
  'LastUpdatePostDate',
  'StudyType',
  'LeadSponsorName',
  'LocationFacility',
  'LocationCity',
  'LocationState',
  'LocationZip',
  'LocationCountry',
  'LocationStatus',
  'LocationGeoPoint',
  'InterventionName',
  'InterventionType'
] as const

interface SearchParams {
  cond?: string
  term?: string
  intr?: string
  titles?: string
  outc?: string
  spons?: string
  lead?: string
  id?: string
  lat?: string
  lng?: string
  locStr?: string
  distance?: string
  start?: string
  primComp?: string
  firstPost?: string
  resFirstPost?: string
  lastUpdPost?: string
  studyComp?: string
  ageRange?: string
  aggFilters?: string
  page?: number
}

interface ApiParams extends Record<string, string | undefined> {
  format: string
  fields: string
  pageSize: string
  countTotal: string
  pageToken?: string
}

export async function searchTrials(params: SearchParams) {
  try {
    console.log('Received search params:', params)

    // Map the params to API v2 format
    const apiQueryParams: Record<string, string> = {}

    // Map search parameters to their API v2 equivalents
    if (params.cond) apiQueryParams['query.cond'] = params.cond
    if (params.term) apiQueryParams['query.term'] = params.term
    if (params.intr) apiQueryParams['query.intr'] = params.intr
    if (params.titles) apiQueryParams['query.title'] = params.titles
    if (params.outc) apiQueryParams['query.outc'] = params.outc
    if (params.spons) apiQueryParams['query.spons'] = params.spons
    if (params.lead) apiQueryParams['query.lead'] = params.lead
    if (params.id) apiQueryParams['query.id'] = params.id

    // Add API-specific parameters
    const apiParams: ApiParams = {
      ...apiQueryParams,
      format: 'json',
      fields: DEFAULT_FIELDS.join('|'),
      pageSize: '10',
      countTotal: 'true'
    }

    // Handle pagination
    if (params.page) {
      apiParams.pageToken = String(params.page * 10)
    }

    // Handle location
    if (params.lat && params.lng && params.distance) {
      apiParams['filter.geo'] = `distance(${params.lat},${params.lng},${params.distance}mi)`
    }

    // Handle age range
    if (params.ageRange) {
      apiParams['filter.age'] = params.ageRange
    }

    // Handle aggregate filters
    if (params.aggFilters) {
      apiParams['filter.advanced'] = params.aggFilters
    }

    // Filter out undefined values before creating URLSearchParams
    const filteredParams: Record<string, string> = Object.entries(apiParams)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = value as string
        return acc
      }, {} as Record<string, string>)

    const queryString = new URLSearchParams(filteredParams).toString()
    const fullUrl = `${BASE_URL}?${queryString}`
    
    console.log('Making request to:', fullUrl)
    console.log('API params:', apiParams)

    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json'
      },
      next: {
        revalidate: 3600 // Cache for 1 hour
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Failed to fetch trials: ${response.statusText}\nResponse: ${errorText}`)
    }

    const data = await response.json()
    console.log('API Response:', {
      totalCount: data.totalCount,
      hasStudies: Boolean(data.studies),
      studiesCount: data.studies?.length
    })

    return {
      studies: data.studies || [],
      totalCount: data.totalCount || 0,
      nextPageToken: data.nextPageToken
    }

  } catch (error) {
    console.error('Error in searchTrials:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
    }
    throw error
  }
} 