'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HistoricalEvidence() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 space-y-8"
    >
      <h2 className="text-3xl font-bold">Historical Evidence</h2>
      
      <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-2xl font-bold mb-4">1893 - The Advent of Safety and Efficacy Trials</h3>
        <p>
          The independent peer-reviewed Journal of the American Medical Association (JAMA) was founded in 1893. It gathered case reports from 144,000 physicians on the safety and effectiveness of drugs.
        </p>
        <Image
          src="https://fdai.earth/wp-content/uploads/2024/03/life-expectancy-historical.jpg"
          alt="Historical life expectancy"
          width={800}
          height={400}
          className="rounded-lg my-4"
        />
      </div>

      <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-2xl font-bold mb-4">1938 - The FDA Requires Phase 1 Safety Trials</h3>
        <p>
          After the Elixir sulfanilamide tragedy, Congress required safety testing for new drugs. This didn't significantly impact the steady increase in life expectancy.
        </p>
        <Image
          src="https://fdai.earth/wp-content/uploads/2024/03/fda-safety-trials-life-expectancy.png"
          alt="FDA safety trials impact on life expectancy"
          width={800}
          height={400}
          className="rounded-lg my-4"
        />
      </div>

      <div className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-2xl font-bold mb-4">1962 - New Efficacy Regulations</h3>
        <p>
          The 1962 Kefauver Harris Amendment dramatically increased regulatory requirements, leading to:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>70% reduction in new treatments</li>
          <li>Explosion in development costs from $74M to over $1B</li>
          <li>Reduced pace of life expectancy growth</li>
        </ul>
        <Image
          src="https://fdai.earth/wp-content/uploads/2024/03/new-treatments-per-year-2.png"
          alt="New treatments per year"
          width={800}
          height={400}
          className="rounded-lg my-4"
        />
      </div>
    </motion.section>
  )
} 