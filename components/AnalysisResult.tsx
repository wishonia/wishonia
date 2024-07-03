import React from "react"

interface AnalysisResultProps {
  result: string
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="mt-5">
      <strong>Analysis Result:</strong>
      <textarea
        value={result}
        readOnly
        className="mt-2 h-36 w-full resize-y rounded-lg border border-gray-300 p-2"
      />
    </div>
  )
}
