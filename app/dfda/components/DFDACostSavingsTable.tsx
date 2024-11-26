"use client"

import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

import {
  clinicalTrialCostData,
  TOTAL_CURRENT_COST,
  TOTAL_NEW_COST,
} from "@/app/dfda/components/cost-savings-data"
import type { CostItem } from "@/app/dfda/cost-savings"

export default function DFDACostSavingsTable() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    if (window.location.hash === "#cost-savings") {
      const element = document.getElementById("cost-savings")
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateSavings = (current: number, new_: number) => {
    return (((current - new_) / current) * 100).toFixed(1)
  }

  const DetailPanel = ({ item }: { item: CostItem }) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-gray-50 px-4 py-6"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border-2 border-black bg-yellow-100 p-4">
          <h4 className="mb-2 font-black">Current Process 📋</h4>
          <p>{item.currentExplanation}</p>
          <p className="mt-2 font-mono font-bold text-gray-700">
            Cost: {formatCurrency(item.currentCost)}
          </p>
        </div>

        <div className="rounded-xl border-2 border-black bg-green-100 p-4">
          <h4 className="mb-2 font-black">Cost Reduction Strategy 📉</h4>
          <p>{item.reductionExplanation}</p>
          <p className="mt-2 font-mono font-bold text-gray-700">
            New Cost: {formatCurrency(item.newCost)}
          </p>
        </div>

        <div className="rounded-xl border-2 border-black bg-blue-100 p-4">
          <h4 className="mb-2 font-black">Remaining Expenses 💡</h4>
          <p>{item.remainingExplanation}</p>
          <p className="mt-2 font-mono font-bold text-gray-700">
            Savings: {calculateSavings(item.currentCost, item.newCost)}%
          </p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div
      id="cost-savings"
      className="relative scroll-mt-24 overflow-hidden rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <motion.h1
        className="mb-6 text-4xl font-black uppercase md:text-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👀Look at those savings! 🤑
      </motion.h1>
      <motion.h2
        className="mb-6 font-black uppercase md:text-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        By decentralizing and automating clinical research, we could reduce the
        cost of new treatments by 95%!
      </motion.h2>

      <div className="-mx-6 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-yellow-300">
                  <th className="p-2 text-left font-black sm:p-4">Cost Item</th>
                  <th className="hidden p-2 text-right font-black sm:table-cell sm:p-4">
                    Current Cost
                  </th>
                  <th className="hidden p-2 text-right font-black sm:table-cell sm:p-4">
                    New Cost
                  </th>
                  <th className="p-2 text-right font-black sm:p-4">Savings</th>
                </tr>
              </thead>
              <tbody>
                {clinicalTrialCostData.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <motion.tr
                      className={`cursor-pointer border-b-2 border-black hover:bg-gray-50 ${
                        expandedItem === item.name ? "bg-gray-50" : ""
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === item.name ? null : item.name
                        )
                      }
                    >
                      <td className="p-2 font-bold sm:p-4">
                        <div className="flex items-center gap-2">
                          {item.emoji} {item.name}
                          {expandedItem === item.name ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 sm:hidden">
                          {formatCurrency(item.currentCost)} →{" "}
                          {formatCurrency(item.newCost)}
                        </div>
                      </td>
                      <td className="hidden p-2 text-right font-mono sm:table-cell sm:p-4">
                        {formatCurrency(item.currentCost)}
                      </td>
                      <td className="hidden p-2 text-right font-mono sm:table-cell sm:p-4">
                        {formatCurrency(item.newCost)}
                      </td>
                      <td className="p-2 text-right sm:p-4">
                        <span className="rounded-full bg-green-400 px-2 py-1 text-sm font-bold sm:px-3 sm:text-base">
                          {calculateSavings(item.currentCost, item.newCost)}%
                        </span>
                      </td>
                    </motion.tr>
                    <tr>
                      <td colSpan={4} className="p-0">
                        <AnimatePresence>
                          {expandedItem === item.name && (
                            <DetailPanel item={item} />
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <motion.tr
                  className="border-t-4 border-black bg-green-300 font-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: clinicalTrialCostData.length * 0.1 }}
                >
                  <td className="p-2 sm:p-4">
                    TOTAL SAVINGS 🎉
                    <div className="mt-1 text-sm sm:hidden">
                      {formatCurrency(TOTAL_CURRENT_COST)} →{" "}
                      {formatCurrency(TOTAL_NEW_COST)}
                    </div>
                  </td>
                  <td className="hidden p-2 text-right sm:table-cell sm:p-4">
                    {formatCurrency(TOTAL_CURRENT_COST)}
                  </td>
                  <td className="hidden p-2 text-right sm:table-cell sm:p-4">
                    {formatCurrency(TOTAL_NEW_COST)}
                  </td>
                  <td className="p-2 text-right sm:p-4">
                    <span className="rounded-full bg-black px-2 py-1 text-sm text-white sm:px-3 sm:text-base">
                      95.7%
                    </span>
                  </td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm italic text-gray-600">
        <p>
          Cost analysis based on data from:{" "}
          <a
            href="https://aspe.hhs.gov/reports/examination-clinical-trial-costs-barriers-drug-development-0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            "Examination of Clinical Trial Costs and Barriers for Drug
            Development"
          </a>{" "}
          by the U.S. Department of Health and Human Services, Office of the
          Assistant Secretary for Planning and Evaluation (ASPE).
        </p>
      </div>

      <div className="mt-6 rounded-xl border-2 border-black bg-blue-100 p-4">
        <h3 className="mb-2 font-black">💡 Key Benefits</h3>
        <ul className="list-inside list-disc space-y-2">
          <li>Automated processes reduce manual labor costs</li>
          <li>AI-driven analysis improves efficiency and accuracy</li>
          <li>Decentralized approach eliminates site-related expenses</li>
          <li>Blockchain technology ensures data integrity</li>
        </ul>

        <p className="mt-4 text-sm text-gray-700">
          Our cost reduction estimates are derived from the ASPE study's
          analysis of clinical trial costs across different therapeutic areas
          and phases, incorporating potential savings from electronic data
          capture, simplified protocols, and decentralized trial approaches.
        </p>
      </div>
    </div>
  )
}