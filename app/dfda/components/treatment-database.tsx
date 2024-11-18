import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, Database, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function TreatmentDatabasePage() {
  return (
    <div className="">
      <header className="mb-12 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">Treatment Database 💊</h1>
        <p className="text-xl font-bold">Comprehensive Information on Foods, Drugs, and Conditions</p>
      </header>

      <main className="space-y-12">
        <section className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Search className="mr-4 h-12 w-12" />
            Search Treatments
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input 
              type="search" 
              placeholder="Enter a food, drug, or condition" 
              className="flex-grow border-4 border-black bg-white p-4 text-xl placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500"
            />
            <Button className="border-4 border-black bg-blue-400 p-6 text-xl font-black text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" type="submit">
              <Search className="mr-2 h-6 w-6" />
              SEARCH
            </Button>
          </div>
        </section>

        <section className="border-4 border-black bg-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Filter className="mr-4 h-12 w-12" />
            Browse Categories
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {['Medications', 'Supplements', 'Foods', 'Conditions', 'Therapies', 'Lifestyle Interventions'].map((category, index) => (
              <Button key={index} className="border-4 border-black bg-white p-4 text-xl font-black text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {category}
              </Button>
            ))}
          </div>
        </section>

        <section className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Database className="mr-4 h-12 w-12" />
            Database Features
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Comprehensive information on treatments, foods, and conditions</li>
            <li>Real-world effectiveness data from decentralized trials</li>
            <li>Side effect profiles and interaction warnings</li>
            <li>User-reported experiences and outcomes</li>
            <li>Integration with FDAi for personalized recommendations</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-blue-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Star className="mr-4 h-12 w-12" />
            Featured Treatments
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {['Vitamin D', 'Intermittent Fasting', 'CBD Oil', 'Meditation', 'Probiotics', 'Exercise'].map((treatment, index) => (
              <div key={index} className="border-4 border-black bg-white p-4 text-center font-bold">
                {treatment}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t-4 border-black bg-white p-4 text-center font-bold">
        <Link href="/" className="inline-flex items-center font-black text-black hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </footer>
    </div>
  )
}