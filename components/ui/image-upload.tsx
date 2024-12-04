"use client"

import * as React from "react"

export interface ImageUploadProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  onRemove?: (index?: number) => void
  multiple?: boolean
  label?: string
}

export function ImageUpload({ label, value, multiple, onChange, onRemove }: ImageUploadProps) {
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