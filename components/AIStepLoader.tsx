'use client'

import { useState, useEffect } from 'react'

import { Progress } from "@/components/ui/progress"

interface AILoadingProps {
  steps: string[];
  currentStepIndex?: number;
}

export default function AIStepLoader({ steps, currentStepIndex: initialStepIndex = 0 }: AILoadingProps) {
  const [currentStep, setCurrentStep] = useState(initialStepIndex)
  const [text, setText] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    const totalDuration = 20000; // Total duration in milliseconds (20 seconds)
    const stepDuration = totalDuration / steps.length; // Duration per step

    const typeWriter = (fullText: string, index: number) => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        interval = setTimeout(() => typeWriter(fullText, index + 1), 50)
      } else {
        setTimeout(() => {
          setProgress((currentStep + 1) * (100 / steps.length))
        }, stepDuration - (fullText.length * 50)) // Adjust delay to fit within stepDuration
      }
    }

    typeWriter(`${steps[currentStep]}...`, 0)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, totalDuration / steps.length)

    return () => {
      clearTimeout(interval)
      clearInterval(stepInterval)
    }
  }, [currentStep, steps])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="h-20 flex items-center justify-center">
          <p className="text-xl text-gray-700">
            {text}
            <span className="animate-pulse">|</span>
          </p>
        </div>
        <Progress value={progress} className="w-full mt-4" />
        <p className="text-sm text-gray-600 mt-2 text-center">
          {Math.round(progress)}% Complete
        </p>
      </div>
    </div>
  )
}
