"use client"

import React, { useEffect, useState } from "react"
import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react"

interface DFDADisclaimerProps {
  children?: React.ReactNode
}

export function DFDADisclaimer({ children }: DFDADisclaimerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem("dfda-disclaimer-dismissed")
    if (isDismissed === "true") {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("dfda-disclaimer-dismissed", "true")
  }

  if (!isVisible) return children

  return (
    <>
      <div className="relative mb-6 rounded-xl border-4 border-black bg-yellow-400 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-black" strokeWidth={3} />
          <p className="flex-1 font-bold text-black">
            Disclaimer: The Decentralized FDA is not yet affiliated with the
            FDA.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Learn More
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg border-2 border-black bg-white p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" strokeWidth={3} />
            </button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-2 border-t-2 border-black pt-4">
            <p>
              We&apos;re working to create a prototype of the platonic ideal of
              what the FDA could be through data-driven automation and
              decentralized research.
            </p>
            <p>
              Our mission is to accelerate medical progress while maintaining
              the highest standards of safety and efficacy.
            </p>
            <p>
              Help us transform healthcare by signing the Cure Acceleration Act
              petition, which aims to update FDA.gov to support automated and
              decentralized clinical trials.
            </p>
            <div className="mt-4">
              <a
                href="/dfda/right-to-trial-act"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Sign Petition
              </a>
            </div>
          </div>
        )}
      </div>
      {children}
    </>
  )
}
