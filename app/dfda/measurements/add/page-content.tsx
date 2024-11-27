"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"

import { MeasurementForm } from "../measurement-form"

interface PageContentProps {
  title: string
  variable?: GlobalVariable | UserVariable
}

export function PageContent({ title, variable }: PageContentProps) {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div
        className="mb-8 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-full border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Activity className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
          {title}
        </h1>
      </motion.div>

      <motion.div
        className="rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MeasurementForm variable={variable} />
      </motion.div>
    </div>
  )
}
