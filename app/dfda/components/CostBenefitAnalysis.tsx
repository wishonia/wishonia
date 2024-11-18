import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Stethoscope, Pill, BarChart } from "lucide-react"
import ConditionSearchAutocomplete from './ConditionSearchAutocomplete'
import TreatmentSearchAutocomplete from './TreatmentSearchAutocomplete'
import { GlobalVariable } from '@/types/models/GlobalVariable'

export default function CostBenefitAnalysis() {
    const [condition, setCondition] = useState('')
    const [treatment, setTreatment] = useState('')

    const handleTreatmentSelect = (treatmentVariable: GlobalVariable) => {
        setTreatment(treatmentVariable.name)
    }

    const handleAnalyze = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Analyzing:', condition, treatment)
        // Implement analysis functionality here
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>Treatment Cost-Benefit Analysis</CardTitle>
                    <CardDescription>
                        This can help you understand if the benefits of a treatment outweigh the cost and risks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnalyze} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Stethoscope className="text-gray-500" />
                            <ConditionSearchAutocomplete
                                onConditionSelect={setCondition}
                                placeholder="Enter medical condition"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Pill className="text-gray-500" />
                            <TreatmentSearchAutocomplete
                                onVariableSelect={handleTreatmentSelect}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit">
                                <BarChart className="mr-2 h-4 w-4" />
                                Analyze
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}