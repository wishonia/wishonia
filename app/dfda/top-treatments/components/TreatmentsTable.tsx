'use client'

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
    }
]

type SortKey = keyof Pick<Treatment, 'safetyScore' | 'efficacyScore' | 'potentialQALYs'>

export function TreatmentsTable() {
    const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments)
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const sortBy = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc'
        }
        setSortConfig({ key, direction })

        const sortedTreatments = [...treatments].sort((a, b) => {
            if (direction === 'asc') {
                return a[key] - b[key]
            }
            return b[key] - a[key]
        })
        setTreatments(sortedTreatments)
    }

    const BarChart = ({ value, max }: { value: number; max: number }) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(value / max) * 100}%` }}
            />
        </div>
    )

    const filteredTreatments = treatments.filter(treatment =>
        treatment.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Treatments</CardTitle>
                <CardDescription>
                    Compare treatments based on safety, efficacy, and potential QALYs
                </CardDescription>
                <div className="mt-4">
                    <Label htmlFor="search">Search Treatments</Label>
                    <Input
                        id="search"
                        placeholder="Search by treatment name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Treatment</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => sortBy('safetyScore')}
                                    className="flex items-center gap-1"
                                >
                                    Safety Score
                                    {sortConfig?.key === 'safetyScore' && (
                                        sortConfig.direction === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => sortBy('efficacyScore')}
                                    className="flex items-center gap-1"
                                >
                                    Efficacy Score
                                    {sortConfig?.key === 'efficacyScore' && (
                                        sortConfig.direction === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => sortBy('potentialQALYs')}
                                    className="flex items-center gap-1"
                                >
                                    Potential QALYs
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-4 w-4 ml-1" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Quality-Adjusted Life Years gained per year of treatment</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {sortConfig?.key === 'potentialQALYs' && (
                                        sortConfig.direction === 'desc' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />
                                    )}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTreatments.map((treatment) => (
                            <TableRow key={treatment.name}>
                                <TableCell className="font-medium">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="text-left">
                                                {treatment.name}
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-sm">
                                                <p className="mb-2">{treatment.description}</p>
                                                <p className="text-sm text-gray-500">Source: {treatment.source}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>{treatment.safetyScore}</span>
                                        </div>
                                        <BarChart value={treatment.safetyScore} max={100} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>{treatment.efficacyScore}</span>
                                        </div>
                                        <BarChart value={treatment.efficacyScore} max={100} />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span>{treatment.potentialQALYs.toFixed(2)}</span>
                                        </div>
                                        <BarChart value={treatment.potentialQALYs} max={1} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
} 