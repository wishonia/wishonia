'use client'

import { useState } from 'react'

import { Button } from "@/components/ui/button"

import { uploadImage } from '../petitionActions'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  folder: string
}

export function ImageUpload({ onUploadComplete, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) {
      console.log('No file selected')
      return
    }

    const file = e.target.files[0]
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    })
    setUploading(true)

    try {
      // Create FormData and append file
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', folder)

      console.log('Uploading file to folder:', folder)
      // Upload using server action
      const response = await uploadImage(formData)
      console.log('Upload response:', response)
      
      if (!response?.url) {
        throw new Error('No URL returned from upload')
      }
      
      console.log('Upload successful, URL:', response.url)
      onUploadComplete(response.url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
      // Clear the input so the same file can be selected again if needed
      e.target.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button 
          type="button" 
          variant="outline" 
          disabled={uploading}
          className="cursor-pointer"
          asChild
        >
          <span>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </Button>
      </label>
    </div>
  )
} 