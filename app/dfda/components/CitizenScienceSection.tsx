'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CitizenScienceSection() {
  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-purple-400 to-indigo-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">Citizen Science</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Create Your Own Studies</h3>
          <p className="text-xl mb-4">
            Anyone can create a study, become a prestigious scientist, get a link, and invite all their friends to join!
          </p>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/create-study.gif"
            alt="Create study demonstration"
            width={1024}
            height={899}
            className="rounded-lg mb-4"
          />
          <Link 
            href="https://safe.fdai.earth/app/public/#/app/study-creation"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Create Study
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Global Scale Studies</h3>
          <p className="text-xl mb-4">
            Studies are published in a Wikipedia for clinical research based on everyone's data, listing the likely effects of every food and drug.
          </p>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/clinipedia-landing.gif"
            alt="Clinipedia interface"
            width={800}
            height={400}
            className="rounded-lg mb-4"
          />
          <Link 
            href="https://studies.fdai.earth/"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Current Studies
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Mega-Studies</h3>
          <p className="text-xl mb-4">
            Look up your condition and see how different foods, drugs and supplements tend to improve or worsen your condition.
          </p>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/clinipedia-inflammatory-pain-small.gif"
            alt="Mega-study example"
            width={800}
            height={400}
            className="rounded-lg mb-4"
          />
          <Link 
            href="https://studies.fdai.earth/variables/Overall_Mood"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Example Mega-Study
            <ArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  )
} 