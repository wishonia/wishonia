import { Metadata } from "next"

import { getMarkdownContent } from "@/lib/content/getMarkdownContent"

import { DFDASignPetitionButton } from "./components/DFDASignPetitionButton"
import { FloatingPetitionButton } from "./components/FloatingPetitionButton"
import { GitHubEditButton } from "./components/GitHubEditButton"
import { PetitionSection } from "./components/PetitionSection"
import CureAccelerationAct from "./components/right-to-trial-act"

export const metadata: Metadata = {
  title: "Right to Trial Act | DFDA",
  description: "Faster Cures, Lower Costs, Universal Access 🚀",
}

export default async function RightToTrialPage() {
  const { html, data } = await getMarkdownContent(
    "globalSolutions/dfda/right-to-trial-act-1.md"
  )

  return (
    <main className="">
      <CureAccelerationAct />

      <FloatingPetitionButton />

      {/* Constitutional Style Act Content */}
      <section className="mt-16 border-t-4 border-[#8B4513]/20 bg-[#f4e4bc] p-4">
        <div className="mx-auto max-w-4xl">
          {/* Petition Sign Section */}
          <PetitionSection />

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
            <div className="mt-16 border-t-4 pt-12 text-center">
              <h3 className="mb-6 font-serif text-2xl">
                Add Your Name to Support This Act
              </h3>
              <DFDASignPetitionButton /> <GitHubEditButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}