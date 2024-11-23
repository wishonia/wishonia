"use client"

import React from "react"
import { motion } from "framer-motion"

import Benefits from "@/app/dfda/right-to-trial-act/components/Benefits"
import FinancialIncentives from "@/app/dfda/right-to-trial-act/components/FinancialIncentives"
import UniversalAccess from "@/app/dfda/right-to-trial-act/components/UniversalAccess"

import Header from "./Header"
import OpenTrialPlatform from "./OpenTrialPlatform"
import ProblemsWithCurrentSystem from "./problems-with-the-current-system"
import RightToTrialActSolutions from "./right-to-trial-act-solutions"

export default function CureAccelerationAct() {
  return (
    <div className="min-h-screen font-mono text-black">
      <Header />
      <main className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <h2 className="mb-4 text-3xl font-black">Overview & Findings 📜</h2>
          <h3 className="mb-2 text-xl font-bold">Title 🏷️</h3>
          <p className="mb-4 text-lg">
            This Act may be cited as the "Right to Trial Act" 📋
          </p>
          <ProblemsWithCurrentSystem />
          <RightToTrialActSolutions />
        </motion.section>
        <OpenTrialPlatform />
        <UniversalAccess />
        <FinancialIncentives />
        <Benefits />
      </main>
    </div>
  )
}
