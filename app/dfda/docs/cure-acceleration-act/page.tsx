import { Metadata } from "next"

import { DFDA_PETITION_ID } from "@/lib/constants"
import { getMarkdownContent } from "@/lib/content/getMarkdownContent"
import { getUserId } from "@/lib/getUserId"
import { checkPetitionSignature } from "@/app/petitions/petitionActions"

import { DFDAPetitionButtons } from "./components/DFDAPetitionButtons"
import { FloatingPetitionButton } from "./components/FloatingPetitionButton"
import CureAccelerationAct from "./components/cure-acceleration-act"
import { DFDABreadcrumbs } from "@/components/Breadcrumbs/DFDABreadcrumbs"

export const metadata: Metadata = {
  title: "Cure Acceleration Act | DFDA",
  description: "Faster Cures, Lower Costs, Universal Access 🚀",
}
export default async function CureAccelerationPage() {
  const { html, data } = await getMarkdownContent(
    "globalSolutions/dfda/cure-acceleration-act.md"
  )

  const hasSigned = await checkPetitionSignature(DFDA_PETITION_ID)

  const userId = await getUserId()

  return (
    <main className="">
      <DFDABreadcrumbs />
      <CureAccelerationAct />
      <FloatingPetitionButton />
      {/* Petition Sign Section */}
      <DFDAPetitionButtons hasSigned={hasSigned} userId={userId} />

      {/* Constitutional Style Act Content */}
      <section className="mt-8 border-t-4 border-[#8B4513]/20 bg-[#f4e4bc] p-4">
        <div className="mx-auto max-w-4xl">
          {/* Constitutional Style Content */}
          <div
            className="prose prose-lg max-w-none
                       bg-[#f4e4bc] p-4 prose-headings:font-serif
                       prose-headings:font-bold prose-headings:text-black
                       prose-p:font-serif prose-p:text-black
                       prose-li:font-serif prose-li:text-black"
          >
            {/* Act Content with Constitutional Styling */}
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              className="[&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:font-serif [&>h2]:text-3xl
                         [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:font-serif [&>h3]:text-2xl
                         [&>ul>li]:relative [&>ul>li]:mb-4
                         [&>ul>li]:before:absolute [&>ul>li]:before:left-[-1em]
                         [&>ul>li]:before:text-[#8B4513] [&>ul>li]:before:content-['•'] 
                         [&>ul]:list-none [&>ul]:pl-8"
            />

            {/* Bottom Petition Section */}
            <DFDAPetitionButtons hasSigned={hasSigned} userId={userId} />
          </div>
        </div>
      </section>
    </main>
  )
}