'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeoBrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'active'
  asChild?: boolean
  href?: string
  external?: boolean
}

export function NeoBrutalistButton({
  children,
  className,
  variant = 'primary',
  asChild,
  href,
  external,
  ...props
}: NeoBrutalistButtonProps) {
  const baseStyles = "border-4 border-black p-4 text-lg font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
  
  const variants = {
    primary: "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    secondary: "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    active: "bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  }

  if (href) {
    return (
      <a
        className={cn(baseStyles, variants[variant], className)}
        href={href}
        {...(external ? {
          target: "_blank",
          rel: "noopener noreferrer"
        } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
} 