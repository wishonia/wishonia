import React from "react"
import { User } from "next-auth"

import qaData from "./HowItWorksData"
import HowItWorksItem from "./HowItWorksItem"

interface HowItWorksSectionProps {
  user?: User
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ user }) => (
    <section className="p-4">
        <header className="p-4 sm:p-8 text-center">
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                HOW IT WORKS
            </h1>
        </header>
        <div className="space-y-16">
            {qaData.map((item, index) => (
                <HowItWorksItem
                    key={index}
                    title={item.title}
                    description={item.description}
                    visual={item.visual}
                    user={user}
                />
            ))}
        </div>
    </section>
)

export default HowItWorksSection
