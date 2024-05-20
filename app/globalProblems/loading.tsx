import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"

export default async function GlobalProblemsLoading() {
  return (
    <Shell>
      <div className="flex justify-center p-8">
        <Icons.spinner className="animate-spin text-4xl" />
      </div>
    </Shell>
  )
}
