import { redirect } from "next/navigation"

import { DateRangePicker } from "@/components/date-range-picker"
import { Shell } from "@/components/layout/shell"
import { MeasurementsList } from "@/components/measurements/measurements-list"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

interface MeasurementsPageProps {
  params: { variableId: number }
  searchParams: { from: string; to: string }
}

export default async function MeasurementsPage({
  params,
  searchParams,
}: MeasurementsPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  return (
    <Shell>
      <div className="space-y-6 px-2 md:px-4">
        <DashboardHeader
          heading="Measurements"
          text="Here are your recent measurements."
        >
          <div className="flex flex-col items-stretch gap-4 md:items-end">
            <DateRangePicker />
          </div>
        </DashboardHeader>
        <div className="overflow-x-auto">
          <MeasurementsList
            user={user}
            measurementsDateRange={{
              from: searchParams.from,
              to: searchParams.to,
            }}
          />
        </div>
        <FloatingActionButton />
      </div>
    </Shell>
  )
}
