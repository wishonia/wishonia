import React, { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// CameraButton component to capture images from webcam or mobile camera
export const CameraButton = ({
  onCapture,
}: {
  onCapture: (blob: Blob | null) => void
}) => {
  const [capturing, setCapturing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream
    }
  }, [videoStream])

  const handleStartCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setVideoStream(stream)
          setShowModal(true)
          setCapturing(true)
        })
        .catch((err) => {
          console.error("Error accessing camera:", err)
          setCapturing(false)
        })
    }
  }

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => onCapture(blob))
      }
      if (videoStream) {
        videoStream
          .getTracks()
          .forEach((track: { stop: () => any }) => track.stop())
      }
      setShowModal(false)
      setCapturing(false)
    }
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" onClick={handleStartCapture}>
            {capturing ? "Capturing..." : "Take Picture"}
          </Button>
        </PopoverTrigger>
        {showModal && (
          <PopoverContent className="modal">
            <video ref={videoRef} autoPlay={true} />
            <Button variant="outline" onClick={handleCapture}>
              Take Picture
            </Button>
          </PopoverContent>
        )}
      </Popover>
    </>
  )
}
