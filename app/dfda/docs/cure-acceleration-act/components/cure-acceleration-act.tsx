"use client"

import React from "react"
import { motion } from "framer-motion"

import Benefits from "@/app/dfda/docs/cure-acceleration-act/components/Benefits"
import FinancialIncentives from "@/app/dfda/docs/cure-acceleration-act/components/FinancialIncentives"
import UniversalAccess from "@/app/dfda/docs/cure-acceleration-act/components/UniversalAccess"

import Header from "./Header"
import OpenTrialPlatform from "./OpenTrialPlatform"
import ProblemsWithCurrentSystem from "./problems-with-the-current-system"
import CureAccelerationActSolutions from "./cure-acceleration-act-solutions"

export default function CureAccelerationAct() {
  return (
    <div className="min-h-screen font-mono text-black">
      <Header />
      <main className="space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="neobrutalist-container"
        >
          <h2 className="neobrutalist-h2">Overview & Findings 📜</h2>
          <h3 className="neobrutalist-h3">Title 🏷️</h3>
          <p className="neobrutalist-p">
            This Act may be cited as the "Cure Acceleration Act" 📋
          </p>
          <ProblemsWithCurrentSystem />
          <CureAccelerationActSolutions />
        </motion.section>
        <OpenTrialPlatform />
        <UniversalAccess />
        <FinancialIncentives />
        <Benefits />
      </main>
    </div>
  )
}
