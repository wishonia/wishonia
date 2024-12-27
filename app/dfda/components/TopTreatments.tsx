import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import ConditionSearchAutocomplete from './ConditionSearchAutocomplete'

export default function TopTreatments() {
    const handleViewRankings = (selectedCondition: string) => {
        console.log('Viewing rankings for:', selectedCondition)
        // Implement rankings view functionality here
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>See Top Treatments</CardTitle>
                    <CardDescription>
                        View a ranked list of the most effective treatments for your condition
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="flex-grow">
                            <ConditionSearchAutocomplete onConditionSelect={handleViewRankings} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}