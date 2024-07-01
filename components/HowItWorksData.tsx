import React from "react"

import { PollRandomGlobalProblems } from "@/components/poll-random-global-problems"
import {GlobalProblemsList} from "@/components/global-problems-list";
import {GlobalProblemSolutionsList} from "@/components/global-problem-solutions-list";
import {PollRandomGlobalProblemSolutions} from "@/components/poll-random-global-problem-solutions";

export interface QAItem {
  question: string
  answer: string
  visual?: React.ReactNode
}

const HowItWorksData: QAItem[] = [
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
    question: "Prioritize Problems",
    answer:
      "In Aggregated Pairwise Preference Allocation (APPA), we show everyone random pairs problems and asked to allocate between them based on relative importance.",
    visual: <PollRandomGlobalProblems />,
  },
  {
    question: "Generate a Crowdsourced Budget",
    answer:
        "By aggregating many of these pairwise comparisons across many people, we can derive a crowdsourced budget allocations.",
    visual: <GlobalProblemsList />,
  },
  {
    question: "Generate and Collect All Possible Solutions",
    answer:
      "Here are the current solutions for solving the problem of Aging, for example.",
    visual: <GlobalProblemSolutionsList globalProblemId={'aging'} />,
  },
  {
    question: "How are the best solutions selected?",
    answer:
      "We use APPA again, but this time for solutions. People compare pairs of proposed solutions, considering factors like feasibility, impact, and cost-effectiveness. AI helps by providing data and analysis to inform these comparisons.",
    visual: <PollRandomGlobalProblemSolutions globalProblemId={'aging'} />,
    //visual: <APPADiagram />,
  },
  {
    question: "Once a solution is chosen, what happens next?",
    answer:
      "The chosen solutions are broken down into smaller, actionable tasks. " +
        "Goal decomposition agents help in this process by identifying necessary steps, potential dependencies, and required skills for each task.",
    //visual: <TaskBreakdownDiagram />,
  },
  {
    question: "Who carries out these tasks?",
    answer:
      "Tasks can be completed by anyone with the right skills – this includes " +
        "both humans and AI. We use AI to match tasks with the most suitable " +
        "people or teams based on their skills, experience, and interests.",
    //visual: <AIAgentDiagram />,
  },
  {
    question:
      "How does it avoid duplicating work that's already being done?",
    answer:
      "AI research agents to continuously scan and catalog existing efforts " +
        "related to each problem and solution. This helps us identify " +
        "opportunities for collaboration and avoid reinventing the wheel.",
    //visual: <AIAgentDiagram />,
  },
  {
    question: "How does it track progress and measure impact?",
    answer:
      "AI research agents also analyze data from various sources, tracking key metrics related " +
        "to each problem and solution. This allows us to measure the " +
        "real-world impact of our efforts and adjust strategies as needed.",
    //visual: <ExampleChart />,
  },
  {
    question: "What if someone has a new idea or solution?",
    answer:
      "New ideas are always welcome! Anyone can submit new problems, solutions, or tasks. ",
    //visual: <ExampleDiagram />,
  },
]

export default HowItWorksData
