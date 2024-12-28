"use client"

import dynamic from "next/dynamic"
import React, { useCallback, useState } from "react"

import { AnalysisResult } from "@/components/AnalysisResult"
import { AnalyzeButton } from "@/components/AnalyzeButton"
import { CameraButton } from "@/components/CameraButton"
import { FileUploader } from "@/components/FileUploader"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { convertFileToBase64 } from "@/lib/convertFileToBase64"
import { getUtcDateTimeWithTimezone } from "@/lib/dateTimeWithTimezone"

const ChatComponent = dynamic(() => import("./ChatComponent"), {
  ssr: true,
})

const App: React.FC = () => {
  // State management for various functionalities
  const [file, setFile] = useState<File | null>(null) // Holds the selected image file
  const [preview, setPreview] = useState<string>("") // URL for the image preview
  const [result, setResult] = useState<string>("") // Stores the analysis result
  const [statusMessage, setStatusMessage] = useState<string>("") // Displays status messages to the user
  const [uploadProgress, setUploadProgress] = useState<number>(0) // Manages the upload progress
  const [textInput, setTextInput] = useState<string>("") // Custom text input by the user
  const [base64Image, setBase64Image] = useState<string>("")

  // Callback for handling file selection changes
  const handleFileChange = useCallback(async (selectedFile: File) => {
    // Updating the state with the new file and its preview URL
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
    setStatusMessage('Image selected. Click "Analyze Image" to proceed.')
    setUploadProgress(0)

    // Convert the file to a base64 string and store it in the state
    const base64 = await convertFileToBase64(selectedFile)
    setBase64Image(base64)
  }, [])

  // Function to handle Blob from CameraButton and convert it to File
  const handleCapture = useCallback(
    (blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], "captured_image.png", { type: blob.type })
        handleFileChange(file)
      }
    },
    [handleFileChange]
  )

  // Function to handle submission for image analysis
  const handleSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    if (!file) {
      setStatusMessage("No file selected!")
      return
    }

    setStatusMessage("Sending request...")
    setUploadProgress(40) // Progress after image conversion

    // Send a POST request to your API endpoint
    const response = await fetch("/api/image2measurements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64Image,
        prompt: textInput,
        utcDateTimeWithTimezone: getUtcDateTimeWithTimezone(),
      }),
    })

    setUploadProgress(60)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiResponse = await response.json()
    setUploadProgress(80) // Progress after receiving response

    if (apiResponse.success) {
      setResult(apiResponse.analysis)
      setStatusMessage("Analysis complete.")
      setUploadProgress(100) // Final progress
    } else {
      setStatusMessage(apiResponse.message)
    }
  }

  return (
    <Shell>
      <DashboardHeader
        heading="Image 2 Measurements"
        text="Upload an Image of a Medication, Food, or Supplement"
      />
      <div className="flex">
        <div className="mx-auto my-5 max-w-md rounded-lg border border-gray-300 p-5 text-center">
          <div className="p-4">
            <CameraButton onCapture={handleCapture} />
          </div>
          <div>OR</div>
          <FileUploader onFileChange={handleFileChange} preview={preview} />
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Optional: Include any additional info"
            className="mb-5 w-full rounded-lg border border-gray-300 p-2"
          />
          <AnalyzeButton
            onClick={handleSubmit}
            uploadProgress={uploadProgress}
          />
          {statusMessage && (
            <p className="mb-5 text-gray-600">{statusMessage}</p>
          )}
          {result && <AnalysisResult result={result} />}
        </div>
        <ChatComponent base64Image={base64Image} />
      </div>
    </Shell>
  )
}

export default App
