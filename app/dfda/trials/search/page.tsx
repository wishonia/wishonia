import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ListStudiesRequest } from "../../lib/clinical-trials-gov"
import AdvancedTrialSearch from "../components/AdvancedTrialSearch"
import TrialsList from "../components/TrialsList"
import { searchTrials } from "../trialActions"

interface SearchPageProps {
  searchParams: Partial<ListStudiesRequest> & {
    sex?: string
    ageRange?: string
    phase?: string[]
    studyType?: string[]
    zipCode?: string
    distance?: string
    status?: string[]
    dateRanges?: string
  }
}

async function getTrials(searchParams: Partial<ListStudiesRequest>) {
  try {
    return await searchTrials(searchParams)
  } catch (error) {
    console.error("Error fetching trials:", error)
    return null
  }
}

function formatSearchCriteria(searchParams: Partial<ListStudiesRequest>) {
  const criteria: string[] = []

  if (searchParams.queryCond) {
    criteria.push(`Condition: ${searchParams.queryCond}`)
  }
  if (searchParams.queryTerm) {
    criteria.push(`Terms: ${searchParams.queryTerm}`)
  }
  if (searchParams.queryIntr) {
    criteria.push(`Intervention: ${searchParams.queryIntr}`)
  }
  if (searchParams.filterGeo) {
    criteria.push(`Location: ${searchParams.filterGeo}`)
  }
  if (searchParams.filterAdvanced) {
    const filters = searchParams.filterAdvanced.split(",")
    filters.forEach((filter) => {
      const [key, value] = filter.split(":")
      switch (key) {
        case "sex":
          criteria.push(`Sex: ${value === "m" ? "Male" : "Female"}`)
          break
        case "phase":
          criteria.push(`Phase: ${value}`)
          break
        case "studyType":
          criteria.push(`Type: ${value.split(" ").join(", ")}`)
          break
        case "healthy":
          criteria.push("Accepts healthy volunteers")
          break
        case "funderType":
          criteria.push(`Funder: ${value.toUpperCase()}`)
          break
        case "results":
          criteria.push(`Results: ${value}`)
          break
        case "docs":
          criteria.push(`Documents: ${value.toUpperCase()}`)
          break
      }
    })
  }

  return criteria
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const searchCriteria = formatSearchCriteria(searchParams)
  const trialsData = await getTrials(searchParams)

  // Parse the search params into the format expected by AdvancedTrialSearch
  const initialFilters = {
    queryCond: searchParams.queryCond,
    queryTerm: searchParams.queryTerm,
    queryIntr: searchParams.queryIntr,
    filterGeo: searchParams.filterGeo,
    ageRange: searchParams.ageRange
      ? {
          min: parseInt(searchParams.ageRange.split("_")[0].replace("y", "")),
          max: parseInt(searchParams.ageRange.split("_")[1].replace("y", "")),
        }
      : undefined,
    filterAdvanced: searchParams.filterAdvanced,
    queryTitles: searchParams.queryTitles,
    queryOutc: searchParams.queryOutc,
    querySpons: searchParams.querySpons,
    queryLead: searchParams.queryLead,
    queryId: searchParams.queryId,
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
              <h2 className="font-bold text-gray-600">
                Current Search Criteria:
              </h2>
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
            <div className="space-y-4">
              <div className="rounded-xl border-4 border-black bg-white p-6 text-center font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-2">Searching for clinical trials...</div>
                <div className="text-sm text-gray-600">
                  This may take a few moments
                </div>
              </div>
              {/* Add skeleton loading UI here if desired */}
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