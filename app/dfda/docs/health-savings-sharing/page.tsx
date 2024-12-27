import { readFileSync } from "fs"
import path from "path"

import { DFDABreadcrumbs } from "@/components/Breadcrumbs/DFDABreadcrumbs"

import HealthSavingsSharing from "./components/health-savings-sharing"

export default function HealthSavingsSharingPage() {
  const markdownPath = path.join(
    process.cwd(),
    "public/globalSolutions/dfda/health-savings-sharing.md"
  )
  const markdownContent = readFileSync(markdownPath, "utf-8")

  return (
    <div className="min-h-screen">
      <DFDABreadcrumbs dynamicValues={{ }} />
      <HealthSavingsSharing content={markdownContent} />
    </div>
  )
}
