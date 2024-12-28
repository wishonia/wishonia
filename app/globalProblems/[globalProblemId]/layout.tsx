import type { GlobalProblem } from "@prisma/client"
import { notFound } from "next/navigation"

import { GlobalProblemBreadcrumbs } from "@/components/globalProblem/GlobalProblemBreadcrumbs"
import prisma from "@/lib/prisma"

interface GlobalProblemLayoutProps {
  children: React.ReactNode
  params: { globalProblemId: string }
}

export default async function GlobalProblemLayout({
  children,
  params,
}: GlobalProblemLayoutProps) {
  let globalProblem: GlobalProblem
  
  try {
    const problem = await prisma.globalProblem.findUnique({
      where: { id: params.globalProblemId }
    })
    
    if (!problem) {
      notFound()
    }

    globalProblem = problem

    if (process.env.NODE_ENV === 'development') {
      console.log('🍞 [Breadcrumbs] Found global problem:', globalProblem.name)
    }
  } catch (error) {
    console.error('Error fetching global problem:', error)
    throw error
  }

  return (
    <>
      <GlobalProblemBreadcrumbs globalProblem={globalProblem} />
      {children}
    </>
  )
} 