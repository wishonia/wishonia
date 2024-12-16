'use client';

import { useEffect, useState } from 'react';
import { GlobalProblem } from '@prisma/client';
import { BarChart, Book, ChevronDown, ChevronUp, Clock, FlaskRoundIcon as Flask, MessageSquare, Newspaper, Trophy, Users } from 'lucide-react';
import { GlobalProblemDashboardData } from "@/lib/schemas/global-problem-dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BarChart as BarChartComponent } from '@/components/ui/bar-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { generateGlobalProblemDashboard } from "@/app/actions/generate-global-problem-dashboard"
import { GlobalProblemSolutionsList } from '../global-problem-solutions-list';
import GlobalCoordinationAgent from '../landingPage/global-coordination-agent';
import { ExtendedUser } from '@/types/auth';
import { PollRandomGlobalProblemSolutions } from '../poll-random-global-problem-solutions';

interface GlobalProblemDashboardProps {
  globalProblem: GlobalProblem;
  user: ExtendedUser;
}

type SectionTitle = 'Overview' | 'Current Solutions' | 'Key Players'

const ICONS: Record<SectionTitle, JSX.Element> = {
  "Overview": <Book className="w-5 h-5" />,
  "Current Solutions": <Flask className="w-5 h-5" />,
  "Key Players": <Users className="w-5 h-5" />
}

export default function GlobalProblemDashboard({ globalProblem, user }: GlobalProblemDashboardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<GlobalProblemDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)
        const data = await generateGlobalProblemDashboard(globalProblem.name)
        setDashboardData(data)
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.')
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [globalProblem])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
         <GlobalCoordinationAgent 
         title={`Initializing ${globalProblem.name} Solving Agent`}
         initialIssue={globalProblem.name}
         ></GlobalCoordinationAgent>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>No data available</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Global Problem: {globalProblem.name}</h1>
          <p className="text-muted-foreground">
            Explore the challenges, solutions, and progress in addressing {globalProblem.name}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.sections.map((section, index) => (
            <Card key={`${section.title}-${index}`} className="relative group">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {ICONS[section.title as SectionTitle] || <Book className="w-5 h-5" />}
                    {section.title}
                  </CardTitle>
                </div>
                <CardDescription>{section.summary}</CardDescription>
              </CardHeader>
              {section.metrics && (
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {section.metrics.map((metric, idx) => (
                      <div key={`${metric.label}-${idx}`} className="space-y-1">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
              <Button
                variant="ghost"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
              >
                {expandedSection === section.title ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Detailed Content */}
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible>
              {dashboardData.sections.map((section, index) => (
                <AccordionItem key={`${section.title}-${index}`} value={section.title}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    {section.title === 'Current Solutions' ? (
                      <GlobalProblemSolutionsList
                        user={user}
                        globalProblemId={globalProblem.id}
                      />
                    ) : (
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="prose prose-sm dark:prose-invert">
                          {section.content}
                        </div>
                      </ScrollArea>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline of Major Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline>
              {dashboardData.timelineItems.map((item, index) => (
                <TimelineItem 
                  key={`timeline-${index}`} 
                  year={item.year} 
                  event={item.event} 
                />
              ))}
            </Timeline>
          </CardContent>
        </Card>

        {/* Latest News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Latest News and Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {dashboardData.newsItems.map((item, index) => (
                <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Research Funding by Field
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartComponent data={dashboardData.researchFunding} />
          </CardContent>
        </Card>

        {/* Discussion Forum Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Discussion Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboardData.discussionTopics.map((topic, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm">{topic.title}</span>
                  <span className="text-xs text-muted-foreground">{topic.replies} replies</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full mt-4">View All Discussions</Button>
          </CardContent>
        </Card>

        {/* Voting Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Vote on Solutions
            </CardTitle>
            <CardDescription>Help prioritize research directions and interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Voting options would go here */}
              <p className="text-sm text-muted-foreground">
                Voting interface will be implemented here...
              </p>
              <PollRandomGlobalProblemSolutions
                globalProblemId={globalProblem.id}
                user={user}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
