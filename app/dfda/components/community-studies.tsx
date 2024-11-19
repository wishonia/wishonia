import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Search, Clipboard, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CommunityStudiesPage() {
  return (
    <div className="">
      <header className="mb-12 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">Community Studies 🔬</h1>
        <p className="text-xl font-bold">Join Groundbreaking Research Initiatives</p>
      </header>

      <main className="space-y-12">
        <section className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Search className="mr-4 h-12 w-12" />
            Find a Study
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input 
              type="search" 
              placeholder="Search by condition, treatment, or keyword" 
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
            <Clipboard className="mr-4 h-12 w-12" />
            Featured Studies
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: "Impact of Intermittent Fasting on Insulin Sensitivity", participants: 1500 },
              { title: "Efficacy of CBD Oil for Anxiety Disorders", participants: 2000 },
              { title: "Long-term Effects of Meditation on Brain Health", participants: 1000 },
              { title: "Gut Microbiome and Its Role in Mental Health", participants: 2500 }
            ].map((study, index) => (
              <div key={index} className="border-4 border-black bg-white p-4">
                <h3 className="mb-2 text-xl font-black">{study.title}</h3>
                <p className="font-bold">Participants: {study.participants}</p>
                <Button className="mt-4 border-2 border-black bg-green-400 p-2 text-sm font-black text-black transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Join Study
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Users className="mr-4 h-12 w-12" />
            Why Participate?
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Contribute to groundbreaking medical research</li>
            <li>Access cutting-edge treatments and therapies</li>
            <li>Receive personalized health insights</li>
            <li>Connect with a community of like-minded individuals</li>
            <li>Help accelerate the development of new treatments</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <TrendingUp className="mr-4 h-12 w-12" />
            Recent Findings
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Vitamin D supplementation shows promise for depression treatment</li>
            <li>Regular exercise linked to improved cognitive function in older adults</li>
            <li>Probiotics may help reduce symptoms of irritable bowel syndrome</li>
            <li>Mindfulness meditation found to lower cortisol levels and reduce stress</li>
          </ul>
        </section>

        <section className="text-center">
          <Button className="border-4 border-black bg-blue-500 p-6 text-2xl font-black text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Create Your Own Study 🚀
          </Button>
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