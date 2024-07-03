import { Metadata } from "next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import DrugClassificationForm from "@/components/dfda/DrugClassificationForm"
import DrugClassificationFormGoogle from "@/components/dfda/DrugClassificationFormGoogle"
import { Shell } from "@/components/layout/shell"

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "How much everyone thinks we should allocate to solving each global problem",
}

interface DashboardProps {
  searchParams: { from: string; to: string }
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  function onSubmit() {
    // TODO: Implement onSubmit
  }

  const initialDrug = {
    name: "Example Drug",
    efficacyRate: 85,
    adverseEventRate: 10,
    severeAdverseEventRate: 2,
    drugInteractionIndex: 3,
    therapeuticIndex: 6,
    abusePotentialScore: 20,
    withdrawalSeverityIndex: 4,
    overdoseRiskFactor: 1.5,
    misuseProbability: 15,
    selfAdministrationSafety: 7,
    accessBenefitRatio: 2,
    societalCostIndex: 30,
  }

  return (
    <Shell>
      <DrugClassificationFormGoogle />
      <DrugClassificationForm></DrugClassificationForm>
    </Shell>
  )
}
