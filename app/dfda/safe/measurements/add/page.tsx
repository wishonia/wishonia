import { Metadata } from "next"
import { getVariable } from "@/lib/dfda"
import { notFound } from "next/navigation"
import { PageContent } from "./page-content"

export const metadata: Metadata = {
  title: "Record a Measurement",
}

export default async function MeasurementAddPage({
  searchParams,
}: {
  searchParams: { 
    variableId?: string,
    variableName?: string,
    type?: 'global' | 'user'
  }
}) {
  let variable = undefined
  
  try {
    if (searchParams.variableId || searchParams.variableName) {
      variable = await getVariable({
        id: searchParams.variableId,
        name: searchParams.variableName,
        type: searchParams.type
      })
    } else {
      variable = await getVariable({
        name: "Overall Mood",
        type: "global"
      })
    }

    if ((searchParams.variableId || searchParams.variableName) && !variable) {
      notFound()
    }
  } catch (error) {
    console.error("Error fetching variable:", error)
    throw error
  }

  const variableName = variable?.name || variable?.variableName || ''
  const title = variableName 
    ? `Track ${variableName}`
    : "Track a Measurement"

  return <PageContent title={title} variable={variable} />
} 