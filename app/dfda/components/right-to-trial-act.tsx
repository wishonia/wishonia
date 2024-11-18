import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RightToTrialActPage() {
  return (
    <div className="">
      <header className="mb-12 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">Right to Trial Act 📜</h1>
        <p className="text-xl font-bold">Revolutionizing Access to Treatments</p>
      </header>

      <main className="space-y-12">
        <section className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <FileText className="mr-4 h-12 w-12" />
            Key Points
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Ensures the right to try any treatment after basic safety testing</li>
            <li>Establishes a free, open platform to cut trial costs</li>
            <li>Removes barriers to access proven treatments</li>
            <li>Measures and rewards real-world results</li>
            <li>Establishes FDAi for ongoing treatment outcome analysis</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <CheckCircle className="mr-4 h-12 w-12" />
            Benefits
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Cuts clinical trial costs by 90% with open infrastructure</li>
            <li>Saves $2 trillion annually by focusing on prevention</li>
            <li>Reduces time-to-market via universal trial participation</li>
            <li>Rewards companies for genuine cures, fostering real price competition</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <AlertTriangle className="mr-4 h-12 w-12" />
            Current System Failures
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>FDA approval process delays access to life-saving treatments by 7-12 years on average</li>
            <li>Only 3% of patients qualify for traditional clinical trials</li>
            <li>Real-world outcome data is collected for less than 10% of approved drugs</li>
            <li>$2.6B average cost of drug development drives 10-100x markup in consumer prices</li>
          </ul>
        </section>

        <section className="text-center">
          <Button className="border-4 border-black bg-purple-500 p-6 text-2xl font-black text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Sign the Petition ✍️
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