"use client"
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, ChevronDown, ChevronUp, Info } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type Treatment = {
    name: string
    safetyScore: number
    efficacyScore: number
    potentialQALYs: number
    description: string
    source: string
}

const initialTreatments: Treatment[] = [
    {
        name: "Cognitive Behavioral Therapy (CBT)",
        safetyScore: 95,
        efficacyScore: 85,
        potentialQALYs: 0.5,
        description: "CBT is a type of psychotherapy that helps patients identify and change negative thought patterns and behaviors.",
        source: "Smith, J. et al. (2020). Journal of Psychiatric Research"
    },
    {
        name: "Selective Serotonin Reuptake Inhibitors (SSRIs)",
        safetyScore: 80,
        efficacyScore: 75,
        potentialQALYs: 0.4,
        description: "SSRIs are a class of antidepressant medications that increase serotonin levels in the brain.",
        source: "Johnson, A. et al. (2019). The Lancet Psychiatry"
    },
    {
        name: "Exercise",
        safetyScore: 100,
        efficacyScore: 70,
        potentialQALYs: 0.3,
        description: "Regular physical activity has been shown to improve mood and reduce symptoms of depression.",
        source: "Brown, L. et al. (2021). Journal of Affective Disorders"
    },
    {
        name: "Mindfulness Meditation",
        safetyScore: 98,
        efficacyScore: 65,
        potentialQALYs: 0.25,
        description: "Mindfulness meditation involves focusing on the present moment and can help reduce stress and depressive symptoms.",
        source: "Lee, K. et al. (2018). Frontiers in Psychology"
    },
    {
        name: "Electroconvulsive Therapy (ECT)",
        safetyScore: 70,
        efficacyScore: 90,
        potentialQALYs: 0.6,
        description: "ECT is a procedure that sends electric currents through the brain to trigger a brief seizure, which can provide relief from severe depression.",
        source: "Garcia, M. et al. (2022). JAMA Psychiatry"
    },
]

type SortKey = keyof Pick<Treatment, 'safetyScore' | 'efficacyScore' | 'potentialQALYs'>

export default function Component() {
    const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments)
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [filterValue, setFilterValue] = useState("")

    const sortBy = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })

        const sortedTreatments = [...treatments].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
            return 0
        })

        setTreatments(sortedTreatments)
    }

    const filteredTreatments = treatments.filter(treatment =>
        treatment.name.toLowerCase().includes(filterValue.toLowerCase())
    )

    const BarChart = ({ value, max }: { value: number; max: number }) => (
        <div className="w-full bg-muted rounded-full h-2.5">
            <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${(value / max) * 100}%` }}
            ></div>
        </div>
    )

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Depression Treatments Ranking</CardTitle>
                    <CardDescription>
                        Comparing the most effective treatments for depression based on safety, efficacy, and potential QALYs gained.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Label htmlFor="filter">Filter treatments:</Label>
                        <Input
                            id="filter"
                            placeholder="Type to filter..."
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Treatment</TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => sortBy('safetyScore')}>
                                            Safety Score
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => sortBy('efficacyScore')}>
                                            Efficacy Score
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button variant="ghost" onClick={() => sortBy('potentialQALYs')}>
                                            Potential QALYs
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTreatments.map((treatment) => (
                                    <React.Fragment key={treatment.name}>
                                        <TableRow className="cursor-pointer" onClick={() => setExpandedRow(expandedRow === treatment.name ? null : treatment.name)}>
                                            <TableCell>{treatment.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="mr-2">{treatment.safetyScore}</span>
                                                    <BarChart value={treatment.safetyScore} max={100} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="mr-2">{treatment.efficacyScore}</span>
                                                    <BarChart value={treatment.efficacyScore} max={100} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <span className="mr-2">{treatment.potentialQALYs.toFixed(2)}</span>
                                                    <BarChart value={treatment.potentialQALYs} max={1} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedRow === treatment.name && (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <div className="p-4 bg-muted rounded-md">
                                                        <h4 className="font-semibold mb-2">Description:</h4>
                                                        <p>{treatment.description}</p>
                                                        <h4 className="font-semibold mt-4 mb-2">Source:</h4>
                                                        <p>{treatment.source}</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>What are QALYs?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            QALY stands for Quality-Adjusted Life Year. It's a measure used in health economics to assess the value of
                            medical interventions. One QALY equates to one year in perfect health. QALYs are calculated by estimating
                            the years of life remaining for a patient following a particular treatment or intervention and weighting
                            each year with a quality-of-life score (on a 0 to 1 scale). It's used to assess the cost-effectiveness of
                            different treatments and to make decisions about resource allocation in healthcare.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Understanding the Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Safety Score (0-100):</strong> Higher scores indicate safer treatments with fewer side effects.</li>
                            <li><strong>Efficacy Score (0-100):</strong> Higher scores indicate more effective treatments in reducing depressive symptoms.</li>
                            <li><strong>Potential QALYs (0-1):</strong> The estimated quality-adjusted life years gained from the treatment. Higher values indicate greater potential benefit.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        The data presented here is for illustrative purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional before starting or changing any treatment for depression.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}