"use client"

import { GlobalSolutionPairAllocation } from "@prisma/client"
import { useRouter } from "next/navigation"
import { User } from "next-auth"
import React, { useState } from "react"

import { AnonymousVoteButton } from "@/components/anonymous-vote-button"
import { LoggedInVoteButton } from "@/components/logged-in-vote-button"
import { Input } from "@/components/ui/input"
import WarVsCuresBarChart from "@/components/war-vs-cures-bar-chart"
import {
  medicalResearchGlobalSolutionId,
  warGlobalSolutionId,
} from "@/lib/api/warVsCures"

interface PollProps {
  user?: User
}
export const PollWarVsCures: React.FC<PollProps> = ({ user }) => {
  const [researchPercentageDesired, setResearchPercentageDesired] = useState(50) // Define allocation state
  const [warPercentageDesired, setWarPercentageDesired] = useState(50) // Define allocation state
  const router = useRouter()

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const researchPercentageDesired = parseInt(event.target.value, 10)
    const warPercentageDesired = 100 - researchPercentageDesired
    setResearchPercentageDesired(researchPercentageDesired)
    setWarPercentageDesired(warPercentageDesired)
    localStorage.setItem(
      "warPercentageDesired",
      warPercentageDesired.toString()
    )
    const allocation: Partial<GlobalSolutionPairAllocation> = {
      thisGlobalSolutionId: warGlobalSolutionId,
      thatGlobalSolutionId: medicalResearchGlobalSolutionId,
      thisGlobalSolutionPercentage: warPercentageDesired,
    }
    localStorage.setItem(
      "globalSolutionPairAllocation",
      JSON.stringify(allocation)
    )
  }

  const onButtonClick = () => {
    localStorage.setItem("afterLoginRedirect", "/warVsCures/results")

    router.push("/warVsCures/results")
  }

  return (
    <>
      <section className="space-y-4 pb-12 pt-4 md:space-y-8 md:pt-5 lg:py-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-0 text-center">
          <p className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
            Global Priorities Referendum on
          </p>
          <h1 className="pt-2 text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            War and Disease
          </h1>
          <div id="poll-description">
            <div className="px-0 pb-2 pt-2 text-sm md:text-xl">
              Humanity has a finite amount of brains and resources.
            </div>
            <div className="px-0 pb-2 text-sm md:text-xl">
              Adjust how much governments globally should allocate to
              war/military vs helping the 2 billion people suffering from
              chronic diseases (like Grandma Kay).
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              id="chart-and-slider-container"
              className="px-4 lg:px-8"
              style={{ maxWidth: "300px" }}
            >
              <WarVsCuresBarChart warPercentageDesired={warPercentageDesired} />
              <Input
                type="range"
                min="0"
                max="100"
                value={researchPercentageDesired.toString()}
                onChange={handleSliderChange}
              />
              <div>
                <span style={{ float: "left" }}>👈 More War</span>
                <span style={{ float: "right" }}>More Cures 👉</span>
              </div>
            </div>
          </div>
          <LoggedInVoteButton
            user={user}
            onButtonClick={onButtonClick}
            data={{ warPercentageDesired: warPercentageDesired }}
          />
          <AnonymousVoteButton user={user} />
        </div>
      </section>
    </>
  )
}
