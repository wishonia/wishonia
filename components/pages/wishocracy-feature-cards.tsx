import { BsLightbulb } from "react-icons/bs"
import { FaRegStar } from "react-icons/fa"

import HeadingText from "@/components/heading-text"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

import { Icons } from "../icons"

function Cards() {
  return (
    <>
      <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
        <BsLightbulb className="text-4xl" />
        <CardTitle>Prioritize Resource Allocation</CardTitle>
        <CardDescription>
          Given two goals or problems, indicate what percentage of $100 should
          be allocated to each.
        </CardDescription>
      </Card>
      <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
        <Icons.pieChart className="text-4xl" />
        <CardTitle>Collective Intelligence</CardTitle>
        <CardDescription>
          We then combine the results to create a pie chart to see the aggregate
          priorities of humanity.
        </CardDescription>
      </Card>
      <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
        <Icons.volunteer className="text-4xl" />
        <CardTitle>Propose Solutions</CardTitle>
        <CardDescription>
          Submit to solve the most pressing problems or fulfill the most desired
          wishes.
        </CardDescription>
      </Card>
      <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
        <FaRegStar className="text-4xl" />
        <CardTitle>A Global ToDo List for Humanity</CardTitle>
        <CardDescription>
          Solutions are decomposed into a decentralized global todo list
          avoiding wasteful duplication of effort.
        </CardDescription>
      </Card>
    </>
  )
}

export default function WishocracyFeatureCards() {
  return (
    <section className="bg-secondary" id="features">
      <div className="container space-y-8 py-12 text-center lg:py-20">
        <HeadingText subtext="Wishocracy prioritizes societal goals and uses collective intelligence to most efficiently allocate our scarce resources to acheive them.">
          How it Works
        </HeadingText>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Cards />
        </div>
      </div>
    </section>
  )
}
