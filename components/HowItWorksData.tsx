import React from "react"

import { GlobalProblemSolutionsList } from "@/components/global-problem-solutions-list"
import { GlobalProblemsList } from "@/components/global-problems-list"
import { PollRandomGlobalProblemSolutions } from "@/components/poll-random-global-problem-solutions"
import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import ActionableTaskStrategyVisualizer from "@/components/landingPage/TaskGalaxyVisualizerWithData";
import TaskAllocationVisualizer from "@/components/landingPage/TaskAllocationVisualizer";
import ResearchEffortCataloger from "@/components/landingPage/ResearchEffortCataloger";
import ImpactTrackerVisualizer from "@/components/landingPage/ImpactTrackerVisualizer";

export interface HowItWorksStep {
  title: string
  description?: string
  visual?: React.ReactNode
}

const HowItWorksData: HowItWorksStep[] = [
  // {
  //   question: "Why are you doing this?",
  //   answer: `Because billions of people and animals are suffering from various global problems.
  //
  //     `,
  //   //visual: <ExampleDiagram />,
  // },
  // {
  //   question: "How does Wishocracy aim to solve the world's problems?",
  //   answer:
  //     "Wishocracy uses a combination of crowdsourcing, AI, and structured problem-solving to tackle global issues. It creates a big list of problems, uses collective intelligence to prioritize them, and then applies AI and human expertise to develop and implement solutions.",
  //   //visual: <ExampleDiagram />,
  // },
  // {
  //   question: "What is the crowdsourced budget in Wishocracy?",
  //   answer:
  //     "The crowdsourced budget is a way for everyone to collectively decide how to allocate resources to different problems. It ensures that our efforts and resources are distributed according to what people collectively believe is most important.",
  //   //visual: <ExampleChart />,
  // },
  // {
  //   question: "How does Wishocracy create this crowdsourced budget?",
  //   answer:
  //     "We use a method called Aggregated Pairwise Preference Allocation (APPA). This approach allows us to capture nuanced preferences from a large number of people efficiently.",
  //   //visual: <APPADiagram />,
  // },
  {
    title: "1. Quantify What Everyone Wants",
    description:
      "We show everyone random pairs problems and allow them to indicate how much they'd donate to each.  " +
        "This is called Pairwise Preference Allocation (PPA).  ",
    visual: <PollRandomGlobalProblems />,
  },
  {
    title: "2. Create a Budget that Matches Everyone's Priorities",
    description:
      "By combining lots of pairwise allocations, we create a crowdsourced budget. " +
        "This would enable us to allocate limited resources to solving the most urgent problems.",
    visual: <GlobalProblemsList />,
  },
  {
    title: "3. List All the Solutions for Each Problem",
    description:
      `We use AI agents to research and list all possible solutions for each problem.
       Here are the current solutions for solving the specific problem of "AGING", for example.`,
    visual: <GlobalProblemSolutionsList globalProblemId={"aging"} />,
  },
  {
    title: "4. Find the Best Solutions",
    description:
      "We use AI and human evaluators to compare and rank solutions based on their feasibility, impact, and " +
        `cost-effectiveness. Here we compare potential solutions for the problem of "AGING".`,
    visual: <PollRandomGlobalProblemSolutions globalProblemId={"aging"} />,
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
  // {
  //   question: "What if someone has a new idea or solution?",
  //   answer:
  //     "New ideas are always welcome! Anyone can submit new problems, solutions, or tasks. ",
  //   visual: <IdeaSubmissionHub />,
  // },
]

export default HowItWorksData
