import React from "react"

interface AnalyzeButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  uploadProgress: number
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  uploadProgress,
}) => {
  return (
    <div className="mb-5 flex items-center justify-center">
      {uploadProgress === 0 || uploadProgress === 100 ? (
        <button
          onClick={onClick}
          className="cursor-pointer rounded-lg bg-blue-500 px-5 py-2 text-lg text-white hover:bg-blue-700"
        >
          Analyze Image
        </button>
      ) : (
        <progress value={uploadProgress} max="100" className="w-1/2" />
      )}
    </div>
  )
}
