import React from "react"

import { NeoBrutalModal } from "@/components/NeoBrutalModal"

interface NeoBrutalModalLayoutProps {
  children: React.ReactNode
  title?: string
  text: string
  content?: React.ReactNode
  primaryText?: string
  secondaryText?: string
  primaryHref?: string | null
  secondaryHref?: string | null
  persistKey?: string
}

export function NeoBrutalModalLayout({
  children,
  text,
  ...modalProps
}: NeoBrutalModalLayoutProps) {
  return (
    <>
      {children}
      <NeoBrutalModal text={text} {...modalProps} />
    </>
  )
}
