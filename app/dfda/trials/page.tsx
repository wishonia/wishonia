import { Clock, MapPin, Microscope, Search } from "lucide-react"

import AdvancedTrialSearch from "./components/AdvancedTrialSearch"

export default function TrialsSearchPage() {
  return (
    <div className="">
      <header className="relative mb-12 overflow-hidden rounded-xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">
          Clinical Trials Search 🔬
        </h1>
        <p className="text-xl font-bold">
          Find and Join Groundbreaking Medical Research Studies
        </p>
      </header>

      <main className="space-y-8">
        {/* Search Section */}
        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-emerald-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            Find Your Trial
          </h2>
          <AdvancedTrialSearch />
        </section>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* For Patients Card */}
          <div className="rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center gap-3">
              <Search className="h-8 w-8" />
              <h2 className="text-2xl font-black">For Patients & Caregivers</h2>
            </div>
            <ul className="space-y-3 text-lg font-bold">
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Search trials by condition
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Filter by location and age
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Find recruiting studies
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Access trial details
                instantly
              </li>
            </ul>
          </div>

          {/* Search Tips Card */}
          <div className="rounded-xl border-4 border-black bg-gradient-to-r from-yellow-400 to-orange-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center gap-3">
              <Microscope className="h-8 w-8" />
              <h2 className="text-2xl font-black">Search Tips</h2>
            </div>
            <ul className="space-y-3 text-lg font-bold">
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Use medical terms or common
                names
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Try alternative spellings
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Use filters for better
                matches
              </li>
              <li className="flex items-center gap-2">
                <span className="text-2xl">•</span> Check regularly for updates
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="h-8 w-8" />
              <h3 className="text-xl font-black">Location-Based Search</h3>
            </div>
            <p className="font-bold text-gray-700">
              Find trials near you by entering your ZIP code and preferred
              distance radius.
            </p>
          </div>

          <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="h-8 w-8" />
              <h3 className="text-xl font-black">Real-Time Updates</h3>
            </div>
            <p className="font-bold text-gray-700">
              Our database is updated daily with new clinical trials and study
              statuses.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
