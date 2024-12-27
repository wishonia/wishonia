"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"

interface NeoBrutalModalProps {
  title?: string
  text: string
  content?: React.ReactNode
  primaryText?: string
  secondaryText?: string
  primaryHref?: string | null
  secondaryHref?: string | null
  persistKey?: string // If provided, will only show once until clicked
}

export function NeoBrutalModal({
  title = "Notice",
  text,
  content,
  primaryText = "Continue",
  secondaryText = "Close",
  primaryHref,
  secondaryHref,
  persistKey,
}: NeoBrutalModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // If persistKey is provided, check localStorage
    if (persistKey) {
      const hasBeenShown = localStorage.getItem(persistKey)
      setIsVisible(!hasBeenShown)
    } else {
      setIsVisible(true)
    }
  }, [persistKey])

  const handleClose = () => {
    if (persistKey) {
      localStorage.setItem(persistKey, "true")
    }
    setIsVisible(false)
  }

  if (!isVisible) return null

  const buttonBaseStyles =
    "px-4 py-2 font-bold border-2 border-black transition-all duration-200 text-sm"
  const primaryButtonStyles = `${buttonBaseStyles} bg-black text-white hover:bg-white hover:text-black`
  const secondaryButtonStyles = `${buttonBaseStyles} bg-white text-black hover:bg-black hover:text-white`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-3xl rotate-[-1deg] transform border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <h2 className="rotate-[1deg] text-2xl font-bold tracking-tight text-black">
              {title}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="rotate-[0.5deg] text-base font-medium leading-7 text-black">
              {text}
            </p>
            {content && (
              <div className="max-w-none rotate-[-0.5deg] text-gray-600">
                {content}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {secondaryHref ? (
              <Link href={secondaryHref} className="w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className={`${secondaryButtonStyles} w-full rotate-[0.5deg]`}
                >
                  {secondaryText}
                </button>
              </Link>
            ) : (
              <button
                onClick={handleClose}
                className={`${secondaryButtonStyles} w-full rotate-[-0.5deg] sm:w-auto`}
              >
                {secondaryText}
              </button>
            )}

            {primaryHref ? (
              <Link href={primaryHref} className="w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className={`${primaryButtonStyles} w-full rotate-[1deg]`}
                >
                  {primaryText}
                </button>
              </Link>
            ) : (
              <button
                onClick={handleClose}
                className={`${primaryButtonStyles} w-full rotate-[-1deg] sm:w-auto`}
              >
                {primaryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
