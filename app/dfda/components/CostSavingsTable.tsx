'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clinicalTrialCostData, TOTAL_CURRENT_COST, TOTAL_NEW_COST } from '@/app/dfda/components/cost-savings-data'
import type { CostItem } from '@/app/dfda/cost-savings'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function CostSavingsTable() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateSavings = (current: number, new_: number) => {
    return ((current - new_) / current * 100).toFixed(1)
  }

  const DetailPanel = ({ item }: { item: CostItem }) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
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
    <div className="relative overflow-hidden rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <motion.h2 
        className="mb-6 text-2xl md:text-4xl font-black uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Savings from a Decentralized Autonomous FDA 💰
      </motion.h2>
      
      <div className="-mx-6 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-yellow-300">
                  <th className="p-2 sm:p-4 text-left font-black">Cost Item</th>
                  <th className="p-2 sm:p-4 text-right font-black hidden sm:table-cell">Current Cost</th>
                  <th className="p-2 sm:p-4 text-right font-black hidden sm:table-cell">New Cost</th>
                  <th className="p-2 sm:p-4 text-right font-black">Savings</th>
                </tr>
              </thead>
              <tbody>
                {clinicalTrialCostData.map((item, index) => (
                  <React.Fragment key={item.name}>
                    <motion.tr 
                      className={`cursor-pointer border-b-2 border-black hover:bg-gray-50 ${
                        expandedItem === item.name ? 'bg-gray-50' : ''
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                    >
                      <td className="p-2 sm:p-4 font-bold">
                        <div className="flex items-center gap-2">
                          {item.emoji} {item.name}
                          {expandedItem === item.name ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 sm:hidden">
                          {formatCurrency(item.currentCost)} → {formatCurrency(item.newCost)}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 text-right font-mono hidden sm:table-cell">{formatCurrency(item.currentCost)}</td>
                      <td className="p-2 sm:p-4 text-right font-mono hidden sm:table-cell">{formatCurrency(item.newCost)}</td>
                      <td className="p-2 sm:p-4 text-right">
                        <span className="rounded-full bg-green-400 px-2 sm:px-3 py-1 font-bold text-sm sm:text-base">
                          {calculateSavings(item.currentCost, item.newCost)}%
                        </span>
                      </td>
                    </motion.tr>
                    <tr>
                      <td colSpan={4} className="p-0">
                        <AnimatePresence>
                          {expandedItem === item.name && <DetailPanel item={item} />}
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
                    <div className="text-sm mt-1 sm:hidden">
                      {formatCurrency(TOTAL_CURRENT_COST)} → {formatCurrency(TOTAL_NEW_COST)}
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 text-right hidden sm:table-cell">{formatCurrency(TOTAL_CURRENT_COST)}</td>
                  <td className="p-2 sm:p-4 text-right hidden sm:table-cell">{formatCurrency(TOTAL_NEW_COST)}</td>
                  <td className="p-2 sm:p-4 text-right">
                    <span className="rounded-full bg-black px-2 sm:px-3 py-1 text-white text-sm sm:text-base">
                      95.7%
                    </span>
                  </td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border-2 border-black bg-blue-100 p-4">
        <h3 className="mb-2 font-black">💡 Key Benefits</h3>
        <ul className="list-inside list-disc space-y-2">
          <li>Automated processes reduce manual labor costs</li>
          <li>AI-driven analysis improves efficiency and accuracy</li>
          <li>Decentralized approach eliminates site-related expenses</li>
          <li>Blockchain technology ensures data integrity</li>
        </ul>
      </div>
    </div>
  )
} 