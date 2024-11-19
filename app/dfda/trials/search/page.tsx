import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { searchTrials } from '../actions'
import TrialsList from '../components/TrialsList'
import AdvancedTrialSearch from '../../components/AdvancedTrialSearch'

interface SearchPageProps {
  searchParams: {
    cond?: string
    term?: string
    intr?: string
    lat?: string
    lng?: string
    locStr?: string
    distance?: string
    aggFilters?: string
    start?: string
    primComp?: string
    firstPost?: string
    resFirstPost?: string
    lastUpdPost?: string
    studyComp?: string
    titles?: string
    outc?: string
    spons?: string
    lead?: string
    id?: string
    locn?: string
    ageRange?: string
    page?: string
  }
}

async function getTrials(searchParams: SearchPageProps['searchParams']) {
  try {
    const data = await searchTrials({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 0
    })
    return data
  } catch (error) {
    console.error('Error fetching trials:', error)
    return null
  }
}

function formatSearchCriteria(searchParams: SearchPageProps['searchParams']) {
  const criteria: string[] = []

  if (searchParams.cond) {
    criteria.push(`Condition: ${searchParams.cond}`)
  }
  if (searchParams.term) {
    criteria.push(`Terms: ${searchParams.term}`)
  }
  if (searchParams.intr) {
    criteria.push(`Intervention: ${searchParams.intr}`)
  }
  if (searchParams.locStr) {
    criteria.push(`Location: ${searchParams.locStr}`)
    if (searchParams.distance) {
      criteria.push(`Within ${searchParams.distance} miles`)
    }
  }
  if (searchParams.ageRange) {
    const [min, max] = searchParams.ageRange.split('_')
    criteria.push(`Age: ${min.replace('y','')} to ${max.replace('y','')} years`)
  }
  if (searchParams.aggFilters) {
    const filters = searchParams.aggFilters.split(',')
    filters.forEach(filter => {
      const [key, value] = filter.split(':')
      switch (key) {
        case 'sex':
          criteria.push(`Sex: ${value === 'm' ? 'Male' : 'Female'}`)
          break
        case 'phase':
          criteria.push(`Phase: ${value}`)
          break
        case 'studyType':
          criteria.push(`Type: ${value.split(' ').join(', ')}`)
          break
        case 'healthy':
          criteria.push('Accepts healthy volunteers')
          break
        case 'funderType':
          criteria.push(`Funder: ${value.toUpperCase()}`)
          break
        case 'results':
          criteria.push(`Results: ${value}`)
          break
        case 'docs':
          criteria.push(`Documents: ${value.toUpperCase()}`)
          break
      }
    })
  }

  return criteria
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const searchCriteria = formatSearchCriteria(searchParams)
  const trialsData = await getTrials(searchParams)

  // Parse the search params into the format expected by AdvancedTrialSearch
  const initialFilters = {
    condition: searchParams.cond,
    otherTerms: searchParams.term,
    intervention: searchParams.intr,
    lat: searchParams.lat ? parseFloat(searchParams.lat) : undefined,
    lng: searchParams.lng ? parseFloat(searchParams.lng) : undefined,
    locStr: searchParams.locStr,
    distance: searchParams.distance ? parseInt(searchParams.distance) : undefined,
    
    // Parse age range from format "44y_88y"
    ageRange: searchParams.ageRange ? {
      min: parseInt(searchParams.ageRange.split('_')[0].replace('y','')),
      max: parseInt(searchParams.ageRange.split('_')[1].replace('y',''))
    } : undefined,

    // Parse aggregated filters
    ...(searchParams.aggFilters ? parseAggFilters(searchParams.aggFilters) : {}),

    // Additional fields
    title: searchParams.titles,
    outcome: searchParams.outc,
    sponsor: searchParams.spons,
    sponsorLead: searchParams.lead,
    studyIds: searchParams.id,
    facilityName: searchParams.locn,
  }

  return (
    <div className="">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link 
            href="/dfda/trials" 
            className="group mb-4 inline-flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Search
          </Link>

          <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="mb-4 text-3xl font-black">Modify Search</h1>
            <AdvancedTrialSearch initialFilters={initialFilters} />
          </div>

          {searchCriteria.length > 0 && (
            <div className="mt-4 rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-bold text-gray-600">Current Search Criteria:</h2>
              <div className="flex flex-wrap gap-2">
                {searchCriteria.map((criteria, index) => (
                  <span 
                    key={index}
                    className="rounded-full border-2 border-black bg-yellow-200 px-3 py-1 text-sm font-bold"
                  >
                    {criteria}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <Suspense 
          fallback={
            <div className="rounded-xl border-4 border-black bg-white p-6 text-center font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              Loading trials...
            </div>
          }
        >
          {trialsData ? (
            <TrialsList searchParams={searchParams} trialsData={trialsData} />
          ) : (
            <div className="rounded-xl border-4 border-black bg-red-100 p-6 text-center font-bold text-red-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              Error loading trials. Please try again.
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

// Helper function to parse aggregated filters
function parseAggFilters(aggFilters: string) {
  const filters: any = {}
  const filterPairs = aggFilters.split(',')
  
  filterPairs.forEach(pair => {
    const [key, value] = pair.split(':')
    switch (key) {
      case 'sex':
        filters.sex = value === 'm' ? 'male' : 'female'
        break
      case 'phase':
        filters.phase = value.split(' ').map(p => `Phase ${p}`)
        break
      case 'studyType':
        const typeMap: Record<string, string> = {
          'int': 'Interventional',
          'obs': 'Observational',
          'pat_reg': 'Patient Registry',
          'exp': 'Expanded Access'
        }
        filters.studyType = value.split(' ').map(t => typeMap[t] || t)
        break
      case 'healthy':
        filters.acceptsHealthy = value === 'y'
        break
      case 'funderType':
        filters.funderType = value.split(',')
        break
      case 'results':
        filters.hasResults = value === 'with'
        break
      case 'docs':
        filters.documents = value.split(',')
        break
      case 'status':
        const statusMap: Record<string, string> = {
          'rec': 'Recruiting',
          'not_yet_rec': 'Not yet recruiting',
          'act': 'Active, not recruiting',
          'comp': 'Completed',
          'enr_by_inv': 'Enrolling by invitation'
        }
        filters.status = value.split(' ').map(s => statusMap[s] || s)
        break
    }
  })
  
  return filters
} 