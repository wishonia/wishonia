import React from "react"

import qaData from "./HowItWorksData"
import QAItem from "./QAItem"

const FAQSection = () => (
  <section className="mb-16 p-4">
    <h2 className="mb-8 text-6xl font-bold uppercase">HOW WISHOCRACY WORKS</h2>
    <div className="space-y-16">
      {qaData.map((item, index) => (
        <QAItem
          key={index}
          question={item.question}
          answer={item.answer}
          visual={item.visual}
        />
      ))}
    </div>
  </section>
)

export default FAQSection
