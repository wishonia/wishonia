import ReferrerCapture from "@/components/ReferrerCapture"
import { Shell } from "@/components/layout/shell"
import { getCurrentUser } from "@/lib/session"

interface ReferrerPageProps {
  params: { referrerId: string }
  searchParams: { from: string; to: string }
}

export default async function ReferrerPage({
  params,
  searchParams,
}: ReferrerPageProps) {
  const user = await getCurrentUser()

  return (
    <Shell>
      <ReferrerCapture referrerId={params.referrerId} />
    </Shell>
  )
}
