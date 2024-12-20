"use client"

import { motion } from "framer-motion"

export default function FinancialIncentives() {
  const economicBenefits = [
    "Government healthcare costs cut in half",
    "Patients save thousands on treatment costs",
    "Insurance premiums drop dramatically",
    "Taxpayers save trillions long-term",
    "Healthcare becomes sustainably affordable",
  ]

  return (
    <motion.div
      className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="mb-4 text-3xl font-black">
        💰 50/50 Health Savings Sharing Program
      </h2>
      <p className="mb-6 text-xl">
        Incentivizing cures instead of lifelong subscriptions to drugs that mask symptoms of disease
      </p>
      <div className="mb-4 border-2 border-black bg-white p-4">
        <h3 className="mb-3 text-xl font-bold">
          Healthcare Savings Sharing Program
        </h3>
        <div className="space-y-2">
          <p className="font-bold">
            Example: Age-Related Disease Prevention 🧬
          </p>
          <div className="space-y-1">
            <p className="font-bold">
              📊 Average lifetime healthcare costs: $1.2M per person
            </p>
            <p className="font-bold">
              👴 ~80% of costs are from age-related diseases: $960k
            </p>
            <p className="font-bold">
              📉 Treatment reduces lifetime costs by: $750k per person
            </p>
            <p className="font-bold">
              👥 At $10k per treatment, 1 million people can afford it
            </p>
            <p className="font-bold">💰 Total lifetime savings: $750 billion</p>
            <p className="ml-4 font-bold">
              🏥 Society keeps: $375 billion in savings
            </p>
            <p className="ml-4 font-bold">
              🎯 Manufacturer receives: $375 billion in rewards
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-2 border-black bg-white p-4 transition-colors hover:bg-green-100">
          <h4 className="mb-2 font-bold">Eligible Treatments</h4>
          <ul className="list-none space-y-1">
            <li>🧬 Age reversal therapies</li>
            <li>🧬 Gene therapies</li>
            <li>🛡️ Disease prevention treatments</li>
            <li>🔄 Regenerative medicine</li>
            <li>⏳ Longevity treatments</li>
          </ul>
        </div>

        <div className="border-2 border-black bg-white p-4 transition-colors hover:bg-green-100">
          <h4 className="mb-2 font-bold">Implementation</h4>
          <ul className="list-none space-y-1">
            <li>📊 The Decentralized FDA tracks long-term health outcomes</li>
            <li>🧮 Transparent savings calculations</li>
            <li>✅ Independent verification of results</li>
            <li>💸 Automated payment distribution</li>
          </ul>
        </div>

        <div className="border-2 border-black bg-white p-4 transition-colors hover:bg-green-100">
          <h4 className="mb-2 font-bold">Economic Benefits</h4>
          <ul className="list-none space-y-1">
            {economicBenefits.map((benefit, i) => (
              <li key={i}>📈 {benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 border-2 border-black bg-white p-4">
        <h4 className="mb-2 font-bold">Virtuous Cycle</h4>
        <ul className="list-none space-y-1">
          <li>💫 Lower prices → More patients can afford treatment</li>
          <li>📈 More patients → Higher total savings generated</li>
          <li>🎯 Higher savings → Bigger rewards for manufacturers</li>
          <li>🚀 Bigger rewards → More investment in cures</li>
          <li>💰 More cures → Even more healthcare savings</li>
        </ul>
      </div>
    </motion.div>
  )
}
