import { Representative } from "@prisma/client"

interface CivicApiResponse {
  offices: Array<{
    name: string
    divisionId: string
    levels: string[]
    roles: string[]
    officialIndices: number[]
  }>
  officials: Array<{
    name: string
    party: string
    phones: string[]
    emails: string[]
    photoUrl: string
    urls: string[]
    channels: Array<{
      type: string
      id: string
    }>
    address: Array<{
      line1: string
      city: string
      state: string
      zip: string
    }>
  }>
}

export async function findRepresentatives(address: string): Promise<Representative[]> {
  if (!process.env.GOOGLE_CIVIC_API_KEY) {
    throw new Error('GOOGLE_CIVIC_API_KEY is not configured')
  }

  if (!address.trim()) {
    throw new Error('Address is required')
  }

  const params = new URLSearchParams({
    key: process.env.GOOGLE_CIVIC_API_KEY!,
    address: address,
    levels: 'country,administrativeArea1,administrativeArea2',
    roles: 'legislatorUpperBody,legislatorLowerBody,headOfGovernment'
  })

  const response = await fetch(
    `https://civicinfo.googleapis.com/civicinfo/v2/representatives?${params}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch representatives')
  }

  const data: CivicApiResponse = await response.json()
  
  return data.offices.flatMap((office, index) => {
    return office.officialIndices.map(officialIndex => {
      const official = data.officials[officialIndex]
      return {
        id: `${office.divisionId}-${officialIndex}`,
        name: official.name,
        office: office.name,
        division: office.divisionId,
        party: official.party,
        phones: official.phones || [],
        emails: official.emails || [],
        photoUrl: official.photoUrl,
        urls: official.urls || [],
        address: official.address?.[0],
        channels: official.channels || []
      }
    })
  })
} 