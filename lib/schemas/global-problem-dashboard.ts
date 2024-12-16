import { z } from 'zod'

export const GlobalProblemDashboardSchema = z.object({
  sections: z.array(z.object({
    title: z.string().describe("Section title - must be one of: 'Overview', 'Current Solutions', or 'Key Players'"),
    summary: z.string().describe("A brief 1-2 sentence summary of the section's main points"),
    content: z.string().describe("Detailed explanation of the section topic, including relevant facts, statistics, and current state of research or implementation"),
    metrics: z.array(z.object({
      value: z.string().describe("Numerical value with appropriate unit or formatting (e.g., '100+', '$2.5B', '45%')"),
      label: z.string().describe("Short description of what the metric represents")
    })).describe("Key statistics and metrics relevant to this section")
  })).describe("Main sections providing overview, solutions, and key organizations/researchers"),

  timelineItems: z.array(z.object({
    year: z.number().describe("Historical year when the event occurred"),
    event: z.string().describe("Description of a significant milestone, discovery, or development in addressing this problem")
  })).describe("Chronological list of important historical events and breakthroughs"),

  newsItems: z.array(z.object({
    title: z.string().describe("Headline for recent news or development in the field"),
    summary: z.string().describe("Brief summary of the news item's key points and significance")
  })).describe("Recent news and updates about progress, breakthroughs, or developments"),

  discussionTopics: z.array(z.object({
    title: z.string().describe("Title of a current debate or discussion topic in the field"),
    replies: z.number().describe("Number of community responses/replies to this topic")
  })).describe("Active discussion topics and debates in the field"),

  researchFunding: z.array(z.object({
    name: z.string().describe("Name of research field or funding category"),
    value: z.number().min(0).max(100).describe("Percentage of total funding allocated to this field (0-100)")
  })).describe("Distribution of research funding across different areas of study")
})

export type GlobalProblemDashboardData = z.infer<typeof GlobalProblemDashboardSchema> 