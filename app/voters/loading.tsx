import { Shell } from "@/components/layout/shell"
import {SpinningLoader} from "@/components/spinningLoader";

export default async function DashboardLoading() {
  return (
    <Shell>
        <SpinningLoader />
    </Shell>
  )
}
