import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Shell } from "@/components/layout/shell"
import {DashboardHeader} from "@/components/pages/dashboard/dashboard-header";
import {DateRangePicker} from "@/components/date-range-picker";
import {MeasurementsList} from "@/components/measurements/measurements-list";


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
      <>
        <DashboardHeader
          heading={`Measurements`}
          text={`Here are your recent measurements.`}
        >
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            <DateRangePicker />
          </div>
        </DashboardHeader>
        <MeasurementsList user={user} measurementsDateRange={{
          from: searchParams.from,
          to: searchParams.to
        }}></MeasurementsList>
      </>
    </Shell>
  )
}
