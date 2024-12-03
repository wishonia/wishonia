"use client"

import * as React from "react"

export interface ImageUploadProps {
  label: string
  value: string | string[]
  multiple?: boolean
  onChange: (value: string | string[]) => void
}

export function ImageUpload({ label, value, multiple, onChange }: ImageUploadProps) {
  const inputId = React.useId()
  
  return (
    <div>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium mb-2"
      >
        {label}
      </label>
      <input 
        id={inputId}
        type="file" 
        accept="image/*"
        multiple={multiple}
        aria-label={label}
        title={label}
        onChange={(e) => {
          // Placeholder for actual upload logic
          if (multiple) {
            onChange([])
          } else {
            onChange("")
          }
        }}
      />
    </div>
  )
} 