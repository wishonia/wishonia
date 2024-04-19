import { BsLightbulb, BsPeopleFill } from "react-icons/bs"
import { FaHandshake, FaRegStar } from "react-icons/fa"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import HeadingText from "@/components/heading-text"

function Cards() {
    return (
        <>
            <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
                <BsLightbulb className="text-4xl" />
                <CardTitle>Collaborative Wish Fulfillment</CardTitle>
                <CardDescription>
                    Harness the power of collective intelligence to identify and fulfill the most impactful wishes in the universe.
                </CardDescription>
            </Card>
            <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
                <BsPeopleFill className="text-4xl" />
                <CardTitle>GenieDAO Formation</CardTitle>
                <CardDescription>
                    Facilitate the creation and collaboration of GenieDAOs, empowering individuals to unite around shared wishes and goals.
                </CardDescription>
            </Card>
            <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
                <FaHandshake className="text-4xl" />
                <CardTitle>Wish Fulfillment Proposals</CardTitle>
                <CardDescription>
                    Enable GenieDAOs to submit proposals for receiving WishTokens in exchange for completing actions that advance wish fulfillment.
                </CardDescription>
            </Card>
            <Card className="flex flex-grow flex-col justify-between gap-4 p-8 text-left dark:bg-secondary">
                <FaRegStar className="text-4xl" />
                <CardTitle>Collective Resource Allocation</CardTitle>
                <CardDescription>
                    Utilize pairwise comparisons and collective decision-making to allocate resources effectively to the most promising wishes and proposals.
                </CardDescription>
            </Card>
        </>
    )
}

export default function FeatureCards() {
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