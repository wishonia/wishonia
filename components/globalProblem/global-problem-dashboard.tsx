'use client';

import { useEffect, useState } from 'react';
import { GlobalProblem, FocusLevel, ExpertiseLevel, Prisma } from '@prisma/client';
import { BarChart, Book, ChevronDown, ChevronUp, Clock, FlaskRoundIcon as Flask, MessageSquare, Trophy, Building2, Users2 } from 'lucide-react';
import { GlobalProblemDashboardData } from "@/lib/schemas/global-problem-dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BarChart as BarChartComponent } from '@/components/ui/bar-chart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Timeline, TimelineItem } from '@/components/ui/timeline';
import { generateGlobalProblemDashboard, getGlobalProblemRelationshipsAction } from "@/app/actions/generate-global-problem-dashboard"
import { GlobalProblemSolutionsList } from '../global-problem-solutions-list';
import GlobalCoordinationAgent from '../landingPage/global-coordination-agent';
import { ExtendedUser } from '@/types/auth';
import { PollRandomGlobalProblemSolutions } from '../poll-random-global-problem-solutions';
import { GlobalProblemRenderer } from './GlobalProblemRenderer';
import { Badge } from '@/components/ui/badge';


import { GlobalProblemOrganizationsList } from './GlobalProblemOrganizationsList'

interface GlobalProblemDashboardProps {
  globalProblem: GlobalProblem;
  user: ExtendedUser;
}

type SectionTitle = 'Overview' | 'Current Solutions' | 'Key Players' | 'Organizations' | 'People'

const ICONS: Record<string, JSX.Element> = {
  "Overview": <Book className="w-5 h-5" />,
  "Current Solutions": <Flask className="w-5 h-5" />,
  "Organizations": <Building2 className="w-5 h-5" />,
  "People": <Users2 className="w-5 h-5" />
}

function getFocusLevelVariant(level: FocusLevel): "default" | "destructive" | "outline" | "secondary" {
  const variants: Record<FocusLevel, "default" | "destructive" | "outline" | "secondary"> = {
    LOW: 'secondary',
    MEDIUM: 'default',
    HIGH: 'destructive',
    PRIMARY: 'destructive'
  }
  return variants[level] || 'default'
}

function getExpertiseLevelVariant(level: ExpertiseLevel): "default" | "destructive" | "outline" | "secondary" {
  const variants: Record<ExpertiseLevel, "default" | "destructive" | "outline" | "secondary"> = {
    BEGINNER: 'secondary',
    MEDIUM: 'default',
    EXPERT: 'destructive',
    AUTHORITY: 'destructive'
  }
  return variants[level] || 'default'
}

type PersonGlobalProblemWithPerson = Prisma.PersonGlobalProblemGetPayload<{
  include: { person: true }
}>

type GlobalProblemRelationshipsType = {
  organizations: Prisma.OrganizationGlobalProblemGetPayload<{
    include: { organization: true }
  }>[]
  people: PersonGlobalProblemWithPerson[]
  total: {
    organizations: number
    people: number
  }
}

export default function GlobalProblemDashboard({ globalProblem, user }: GlobalProblemDashboardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<GlobalProblemDashboardData | null>(null)
  const [relationships, setRelationships] = useState<GlobalProblemRelationshipsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 [Dashboard] Loading data for problem:', globalProblem.name)
        }
        setLoading(true)
        setError(null)
        const [dashData, relData] = await Promise.all([
          generateGlobalProblemDashboard(globalProblem.name),
          getGlobalProblemRelationshipsAction(globalProblem.id)
        ])
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [Dashboard] Loaded data successfully:', {
            hasDashData: !!dashData,
            hasRelData: !!relData,
            sections: dashData?.sections.length,
            organizations: relData?.organizations.length,
            people: relData?.people.length
          })
        }
        setDashboardData(dashData)
        setRelationships(relData)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ [Dashboard] Error loading data:', err)
        }
        setError('Failed to load dashboard data. Please try again later.')
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
    <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
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
        <Accordion type="single" collapsible>
          <AccordionItem value="overview">
            <AccordionTrigger className="justify-start">Overview</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="prose prose-sm dark:prose-invert">
                  <GlobalProblemRenderer globalProblem={globalProblem} />
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="current-solutions">
            <AccordionTrigger className="justify-start">Current Solutions</AccordionTrigger>
            <AccordionContent>
              <GlobalProblemSolutionsList
                user={user}
                globalProblemId={globalProblem.id}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="organizations">
            <AccordionTrigger className="justify-start">Organizations</AccordionTrigger>
            <AccordionContent>
              <GlobalProblemOrganizationsList
                globalProblem={globalProblem}
                user={user}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="people">
            <AccordionTrigger className="justify-start">Key People</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relationships?.people.map((personRelation) => (
                    <Card key={personRelation.person.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {personRelation.person.image && (
                            <img 
                              src={personRelation.person.image} 
                              alt={personRelation.person.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <CardTitle className="text-lg">{personRelation.person.name}</CardTitle>
                            {personRelation.person.jobTitle && (
                              <CardDescription>{personRelation.person.jobTitle}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {personRelation.person.bio && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {personRelation.person.bio}
                          </p>
                        )}
                        <div className="space-y-1">
                          {personRelation.person.company && (
                            <p className="text-sm">
                              <span className="font-semibold">Organization:</span> {personRelation.person.company}
                            </p>
                          )}
                          {personRelation.person.location && (
                            <p className="text-sm">
                              <span className="font-semibold">Location:</span> {personRelation.person.location}
                            </p>
                          )}
                        </div>
                        {personRelation.expertise && (
                          <Badge variant={getExpertiseLevelVariant(personRelation.expertise)}>
                            {personRelation.expertise}
                          </Badge>
                        )}
                        {personRelation.role && (
                          <p className="text-sm">
                            <span className="font-semibold">Role:</span> {personRelation.role}
                          </p>
                        )}
                        {personRelation.publications?.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold text-sm">Publications:</p>
                            <ul className="list-disc list-inside text-sm">
                              {personRelation.publications.map((pub: string, i: number) => (
                                <li key={i}>{pub}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
            <CardDescription>
              Help use use collective intelligence through Aggregated
              Pairwise Preference Allocation to prioritize research directions and interventions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
