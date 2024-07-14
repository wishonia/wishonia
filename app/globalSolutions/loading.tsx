import { Shell } from "@/components/layout/shell"
import {SpinningLoader} from "@/components/spinningLoader";

export default async function GlobalSolutionsLoading() {
  return (
    <Shell>
        <SpinningLoader />
    </Shell>
  )
}
