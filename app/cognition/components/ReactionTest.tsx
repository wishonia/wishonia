'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'

import { postMeasurements } from '@/app/dfda/dfdaActions'

export default function ReactionTest() {
  const { data: session } = useSession()
  const [state, setState] = useState<'waiting' | 'ready' | 'clicked' | 'complete'>('waiting')
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [results, setResults] = useState<number[]>([])
  const [variableId, setVariableId] = useState<number | null>(null)

  const saveMeasurement = async (value: number) => {
    if (!session?.user?.id) return

    try {
      const measurement = {
        variableName: "Reaction Time",
        sourceName: "Wishonia",
        unitName: "Milliseconds",
        unitAbbreviatedName: "ms",
        value,
        startAt: new Date().toISOString(),
        variableCategoryName: "Cognitive Performance",
        note: "Reaction time test result"
      }

      const response = await postMeasurements([measurement], session.user.id)
      if (response?.data?.userVariables?.[0]?.variableId) {
        setVariableId(response.data.userVariables[0].variableId)
      }
    } catch (error) {
      console.error('Failed to save measurement:', error)
    }
  }

  const startTest = useCallback(() => {
    setState('waiting')
    // Random delay between 1-5 seconds
    const delay = 1000 + Math.random() * 4000
    
    setTimeout(() => {
      setStartTime(Date.now())
      setState('ready')
    }, delay)
  }, [])

  // Start test on initial load
  useEffect(() => {
    startTest()
  }, [startTest])

  const handleClick = async () => {
    if (state === 'ready') {
      const endTime = Date.now()
      const time = endTime - startTime
      setReactionTime(time)
      setResults(prev => [...prev, time])
      setState('complete')
      
      // Save the measurement
      await saveMeasurement(time)
    } else if (state === 'waiting') {
      setState('clicked')
    } else if (state === 'complete' || state === 'clicked') {
      startTest()
    }
  }

  const getAverageTime = () => {
    if (results.length === 0) return null
    const sum = results.reduce((a, b) => a + b, 0)
    return Math.round(sum / results.length)
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Reaction Time Test</h2>
      
      <div 
        onClick={handleClick}
        className={`
          w-full h-48 rounded-lg flex items-center justify-center cursor-pointer
          ${state === 'waiting' ? 'bg-gray-200' : ''}
          ${state === 'ready' ? 'bg-green-500' : ''}
          ${state === 'clicked' ? 'bg-red-500' : ''}
          ${state === 'complete' ? 'bg-blue-500' : ''}
        `}
      >
        {state === 'waiting' && <p className="text-gray-700 font-medium">Wait for green...</p>}
        {state === 'ready' && <p className="text-white font-bold text-xl">Click!</p>}
        {state === 'clicked' && <p className="text-white font-medium">Too early! Click to try again</p>}
        {state === 'complete' && (
          <div className="text-center text-white">
            <p className="text-3xl font-bold">{reactionTime}ms</p>
            <p className="font-medium">Click to try again</p>
          </div>
        )}
      </div>

      {variableId && (
        <div className="mt-6">
          <Link 
            href={`/dfda/userVariables/${variableId}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Your Reaction Time History
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">Average reaction time: {getAverageTime()}ms</p>
          <p className="text-sm text-gray-600 mt-2">
            {results.length} test{results.length === 1 ? '' : 's'} completed
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>Average adult reaction times:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>Excellent: &lt;200ms</li>
          <li>Good: 200-250ms</li>
          <li>Average: 250-300ms</li>
          <li>Below average: &gt;300ms</li>
        </ul>
      </div>
    </div>
  )
} 