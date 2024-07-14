import { Shell } from "@/components/layout/shell"
import {SpinningLoader} from "@/components/spinningLoader";

export default async function GlobalProblemsLoading() {
  return (
    <Shell>
        <SpinningLoader />
    </Shell>
  )
}
