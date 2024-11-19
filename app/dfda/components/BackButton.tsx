'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = 'Back to dFDA' }: BackButtonProps) {
  return (
    <Link 
      href={href}
      aria-label={label}
      className="group mb-6 inline-flex items-center gap-2 rounded-xl border-4 border-black bg-white px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
    >
      <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
      {label}
    </Link>
  )
}