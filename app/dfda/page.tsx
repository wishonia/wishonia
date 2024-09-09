"use client"
import React from 'react'
import FindTreatments from './components/FindTreatments'
import HealthTrackingLinkBoxes from './components/HealthTrackingLinkBoxes'
import CostBenefitAnalysis from './components/CostBenefitAnalysis'
import TopTreatments from './components/TopTreatments'
import TreatmentConditionSearchBox from "@/app/dfda/components/TreatmentConditionSearchBox";

export default function DFDAPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <TreatmentConditionSearchBox />
            <FindTreatments />
            <HealthTrackingLinkBoxes />
            <CostBenefitAnalysis />
            <TopTreatments />
        </div>
    )
}