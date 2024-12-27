'use client'

import { motion } from 'framer-motion'
import { SearchIcon, ClipboardCheckIcon, PackageIcon, TestTubesIcon } from 'lucide-react'

export function ImprovedFDASection() {
  const steps = [
    {
      icon: <SearchIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "See the Most Effective Treatments",
      description: "Enter your condition to see a ranked list of the most effective treatments and ongoing trials, powered by real patient outcomes"
    },
    {
      icon: <ClipboardCheckIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Instantly Join a Trial",
      description: "Join trials with one click - no paperwork hassle. Smart matching ensures you're paired with the most suitable treatments"
    },
    {
      icon: <PackageIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "Home Delivery",
      description: "Receive treatments directly at your doorstep, with clear instructions and ongoing support from the trial team"
    },
    {
      icon: <TestTubesIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "Effortless Data Sharing",
      description: "Complete simple surveys and home lab tests. Your data helps improve treatments for everyone while ensuring your safety"
    }
  ]

  return (
      <>
        <section className="container mx-auto px-6 py-24">
          <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6}}
              className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              A New and Improved FDA.gov
            </h2>
            <p className="text-neutral-400">
              Go to the current fda.gov as a patient and you'll likely be very disappointed.
              Patients deserve a streamlined, patient-centric approach to accessing cutting-edge treatments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
                <motion.div
                    key={index}
                    initial={{opacity: 0, y: 30}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2
                    }}
                    className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-neutral-400">{step.description}</p>
                </motion.div>
            ))}
          </div>
        </section>
        </>
        )
        }