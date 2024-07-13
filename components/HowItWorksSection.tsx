import React from "react"
import { User } from "next-auth"

import qaData from "./HowItWorksData"
import QAItem from "./QAItem"

interface HowItWorksSectionProps {
  user?: User
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ user }) => (
  <section className="mb-16 p-4">
    <h2 className="mb-8 text-5xl font-bold uppercase">HOW IT WORKS</h2>
    <div className="space-y-16">
      {qaData.map((item, index) => (
        <QAItem
          key={index}
          question={item.question}
          answer={item.answer}
          visual={item.visual}
          user={user}
        />
      ))}
    </div>
  </section>
)

export default HowItWorksSection
