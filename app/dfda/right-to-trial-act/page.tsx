import { Metadata } from 'next'
import { getMarkdownContent } from '@/lib/content/getMarkdownContent'
import { PetitionSection } from './components/PetitionSection'
import { FloatingPetitionButton } from './components/FloatingPetitionButton'
import { DFDASignPetitionButton } from './components/DFDASignPetitionButton'
import CureAccelerationAct from './components/right-to-trial-act'
import { GitHubEditButton } from './components/GitHubEditButton'

export const metadata: Metadata = {
  title: 'Right to Trial Act | DFDA',
  description: 'A revolutionary act guaranteeing every patient\'s right to try treatment',
}

export default async function RightToTrialPage() {
  const { html, data } = await getMarkdownContent('globalSolutions/dfda/right-to-trial-act-1.md')
  
  return (
    <main className="">
      <CureAccelerationAct />

      <FloatingPetitionButton />

      {/* Constitutional Style Act Content */}
      <section className="p-4 bg-[#f4e4bc] border-t-4 border-[#8B4513]/20 mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Petition Sign Section */}
          <PetitionSection />

          {/* Constitutional Style Content */}
          <div 
            className="prose prose-lg max-w-none
                       prose-headings:font-serif prose-headings:text-black prose-headings:font-bold
                       prose-p:text-black prose-p:font-serif
                       prose-li:text-black prose-li:font-serif
                       bg-[#f4e4bc] p-4"
          >


            {/* Act Content with Constitutional Styling */}
            <div 
              dangerouslySetInnerHTML={{ __html: html }}
              className="[&>h2]:text-3xl [&>h2]:font-serif [&>h2]:mt-12 [&>h2]:mb-6
                         [&>h3]:text-2xl [&>h3]:font-serif [&>h3]:mt-8 [&>h3]:mb-4
                         [&>ul]:list-none [&>ul]:pl-8
                         [&>ul>li]:mb-4 [&>ul>li]:relative
                         [&>ul>li]:before:content-['•'] [&>ul>li]:before:absolute 
                         [&>ul>li]:before:left-[-1em] [&>ul>li]:before:text-[#8B4513]"
            />

            {/* Bottom Petition Section */}
            <div className="mt-16 text-center border-t-4 pt-12">
              <h3 className="text-2xl font-serif mb-6">Add Your Name to Support This Act</h3>
              <DFDASignPetitionButton /> <GitHubEditButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 