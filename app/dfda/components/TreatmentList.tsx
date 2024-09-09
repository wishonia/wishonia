'use client'

import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { DfdaCondition, DfdaConditionTreatment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type TreatmentListProps = {
    condition: DfdaCondition & {
        conditionTreatments: (DfdaConditionTreatment & {
            treatment: { name: string }
        })[]
    }
};

function calculateEffectivenessScore(treatment: {
    majorImprovement: number;
    moderateImprovement: number;
    noEffect: number;
    worse: number;
    muchWorse: number;
}): number {
    const weights = {
        majorImprovement: 2,
        moderateImprovement: 1,
        noEffect: 0,
        worse: -1,
        muchWorse: -2
    };

    const totalResponses =
        treatment.majorImprovement +
        treatment.moderateImprovement +
        treatment.noEffect +
        treatment.worse +
        treatment.muchWorse;

    if (totalResponses === 0) return 0;

    const weightedSum =
        weights.majorImprovement * treatment.majorImprovement +
        weights.moderateImprovement * treatment.moderateImprovement +
        weights.noEffect * treatment.noEffect +
        weights.worse * treatment.worse +
        weights.muchWorse * treatment.muchWorse;

    // Normalize to a 0-100 scale
    return ((weightedSum / totalResponses) + 2) * 25;
}

function toTitleCase(str: string): string {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export default function TreatmentList({ condition }: TreatmentListProps) {

    const [treatments, setTreatments] = useState(condition.conditionTreatments)
    const [sortBy, setSortBy] = useState<'effectiveness' | 'popularity'>('effectiveness')

    const handleSort = (type: 'effectiveness' | 'popularity') => {
        setSortBy(type)
        const sorted = [...treatments].sort((a, b) =>
            type === 'popularity'
                ? b.popularity - a.popularity
                : calculateEffectivenessScore(b) - calculateEffectivenessScore(a)
        )
        setTreatments(sorted)
    }

    const getConfidence = (popularity: number) => {
        if (popularity > 50) return { level: 'HIGH', color: 'bg-green-500' };
        if (popularity > 25) return { level: 'MEDIUM', color: 'bg-yellow-500' };
        return { level: 'LOW', color: 'bg-red-500' };
    }

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2
                    className={`text-xl font-semibold cursor-pointer ${sortBy === 'popularity' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleSort('popularity')}
                >
                    MOST TRIED
                </h2>
                <h2
                    className={`text-xl font-semibold cursor-pointer ${sortBy === 'effectiveness' ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleSort('effectiveness')}
                >
                    HIGHEST AVERAGE RATING
                </h2>
            </div>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="All treatments" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All treatments</SelectItem>
                </SelectContent>
            </Select>
            <div className="space-y-4 mt-4">
                {treatments.map((treatment, index) => {
                    const effectivenessScore = calculateEffectivenessScore(treatment);
                    const confidence = getConfidence(treatment.popularity);
                    return (
                        <Card key={treatment.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="flex items-start p-4">
                                <div className="mr-4 flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground mb-1">Confidence</span>
                                    <Badge className={`${confidence.color} text-white`}>
                                        {confidence.level}
                                    </Badge>
                                </div>
                                <div className="flex-grow">
                                    <div className="text-primary font-bold">#{index + 1}</div>
                                    <Link
                                        href={`/dfda/treatments/${encodeURIComponent(treatment.treatment.name)}`}
                                        className="hover:underline"
                                    >
                                        <h3 className="font-bold">{toTitleCase(treatment.treatment.name)}</h3>
                                    </Link>
                                    <div className="mt-2">
                                        <div className="flex items-center">
                                            <span className="text-xs text-muted-foreground mr-2">Effectiveness</span>
                                            <div className="flex-grow bg-secondary rounded-full h-2.5">
                                                <div
                                                    className="bg-primary h-2.5 rounded-full"
                                                    style={{ width: `${effectivenessScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold ml-2">{Math.round(effectivenessScore)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </>
    )
}