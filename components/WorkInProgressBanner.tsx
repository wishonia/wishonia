"use client"

import { AlertTriangle, X } from "lucide-react"
import React, { useState } from "react"

interface WorkInProgressBannerProps {
  message?: React.ReactNode
}

export default function WorkInProgressBanner({
  message = (
    <>
      Work in progress!{" "}
      <span className="[-webkit-text-stroke:3px_black] [text-shadow:3px_3px_0px_rgba(0,0,0,1)]">
        🚧
      </span>{" "}
      <a
        href="https://github.com/wishonia/wishonia/issues/new"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <span className="inline-block">👉</span>
        <span>Report Bug</span>
      </a>{" "}
      or{" "}
      <a
        href="https://github.com/wishonia/wishonia"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <span className="inline-block">⭐</span>
        <span>Contribute</span>
      </a>
    </>
  ),
}: WorkInProgressBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative mb-6 rounded-xl border-4 border-black bg-yellow-400 p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-black" strokeWidth={3} />
        <p className="flex-1 font-bold text-black">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="rounded-lg border-2 border-black bg-white p-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
