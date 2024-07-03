import React, { useCallback, useState } from "react"

interface FileUploaderProps {
  onFileChange: (file: File) => void
  preview: string
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileChange,
  preview,
}) => {
  const [dragOver, setDragOver] = useState<boolean>(false)

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragOver(true)
    },
    []
  )

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragOver(false)
      const files = event.dataTransfer.files
      if (files.length) {
        onFileChange(files[0])
      }
    },
    [onFileChange]
  )

  return (
    <div
      className={`mb-5 cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-10 ${dragOver ? "border-blue-300 bg-gray-100" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("fileUpload")?.click()}
    >
      <input
        id="fileUpload"
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0])
          }
        }}
        accept="image/*"
        className="hidden"
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mx-auto mb-5 max-h-48 max-w-full"
        />
      ) : (
        <p>Drag & drop or click to select image</p>
      )}
    </div>
  )
}
