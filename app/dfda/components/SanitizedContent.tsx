'use client'

import { sanitizeHtml } from '@/lib/utils/sanitizeHtml'

interface SanitizedContentProps {
  html: string
  containerClass?: string
}

export function SanitizedContent({ html, containerClass = '' }: SanitizedContentProps) {
  return (
    <div 
      className={`neobrutalist-p prose prose-stone max-w-none ${containerClass}`}
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(html)
      }} 
    />
  )
} 