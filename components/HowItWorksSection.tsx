import { User } from "next-auth"
import React, { useMemo } from "react"

import {GlobalProblemSolutionsList} from "@/components/global-problem-solutions-list";
import {GlobalProblemsList} from "@/components/global-problems-list";
import ImpactTrackerVisualizer from "@/components/landingPage/ImpactTrackerVisualizer";
import ResearchEffortCataloger from "@/components/landingPage/ResearchEffortCataloger";
import TaskAllocationVisualizer from "@/components/landingPage/TaskAllocationVisualizer";
import ActionableTaskStrategyVisualizer from "@/components/landingPage/TaskGalaxyVisualizerWithData";
import {PollRandomGlobalProblemSolutions} from "@/components/poll-random-global-problem-solutions";
import {PollRandomGlobalProblems} from "@/components/poll-random-global-problems";

import HowItWorksItem from "./HowItWorksItem"

interface HowItWorksSectionProps {
  user?: User
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ user }) => {
    const problemName = "Alzheimer's Disease"
    const problemId = "alzheimer's-disease"
    const qaData = useMemo(() => [
        {
            title: "1. Quantify What Everyone Wants",
            description:
                "We show everyone random pairs problems and allow them to indicate how much they'd donate to each.  " +
                "This is called Pairwise Preference Allocation (PPA).  ",
            visual: <PollRandomGlobalProblems user={user}/>,
        },
        {
            title: "2. Create a Budget that Matches Everyone's Priorities",
            description:
                "By combining lots of pairwise allocations, we create a crowdsourced budget. " +
                "This would enable us to allocate limited resources to solving the most urgent problems.",
            visual: <GlobalProblemsList user={user} />,
        },
        {
            title: "3. Catalog All the Solutions for Each Problem",
            description:
                `We use AI agents to research and list all possible solutions for each problem.
       Here are the current solutions for solving the specific problem of "${problemName}", for example.`,
            visual: <GlobalProblemSolutionsList
                user={user}
                globalProblemId={problemId} />,
        },
        {
            title: "4. Find the Best Solutions",
            description:
                "We use AI and human evaluators to compare and rank solutions based on their feasibility, impact, and " +
                `cost-effectiveness. Here we compare potential solutions for the problem of "${problemName}".`,
            visual: <PollRandomGlobalProblemSolutions
                user={user}
                globalProblemId={problemId} />,
            //visual: <APPADiagram />,
        },
        {
            title: "5. Break Down Solutions into the Smallest Actionable Tasks",
            description:
                "",
            visual: <ActionableTaskStrategyVisualizer />,
        },
        {
            title: "6. Find the Best People to Work on Each Task",
            description:
                "Tasks can be completed by anyone with the right skills – this includes " +
                "both humans and AI. We use AI to match tasks with the most suitable " +
                "people or teams based on their skills, experience, and interests.",
            visual: <TaskAllocationVisualizer />,
        },
        {
            title: "7. Avoid Wasteful Duplication of Effort",
            description:
                "AI research agents to continuously scan and catalog existing efforts " +
                "related to each problem and solution.",
            visual: <ResearchEffortCataloger />,
        },
        {
            title: "8. Track Progress and Measure Impact",
            description:
                "AI research agents also analyze data from various sources, tracking key metrics related " +
                "to each problem and solution. This allows us to measure the " +
                "real-world impact of our efforts and adjust strategies as needed.",
            visual: <ImpactTrackerVisualizer />,
        },
    ], [user])

    return (
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
}

export default HowItWorksSection