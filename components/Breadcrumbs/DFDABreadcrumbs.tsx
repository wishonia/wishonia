'use client'

import { Breadcrumbs } from "./Breadcrumbs"

interface DFDABreadcrumbsProps {
  dynamicValues?: Record<string, string>
}

export function DFDABreadcrumbs({ dynamicValues = {} }: DFDABreadcrumbsProps) {
  return <Breadcrumbs dynamicValues={dynamicValues} startSegment="dfda" />
} 