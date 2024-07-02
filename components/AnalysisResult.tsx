import React from 'react';

interface AnalysisResultProps {
  result: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="mt-5">
      <strong>Analysis Result:</strong>
      <textarea value={result} readOnly className="w-full h-36 p-2 mt-2 border border-gray-300 rounded-lg resize-y" />
    </div>
  );
};
