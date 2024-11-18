"use client"
import React from 'react'
import FindTreatments from './components/FindTreatments'
import HealthTrackingLinkBoxes from './components/HealthTrackingLinkBoxes'
import CostBenefitAnalysis from './components/CostBenefitAnalysis'
import TopTreatments from './components/TopTreatments'
import TreatmentConditionSearchBox from "@/app/dfda/components/TreatmentConditionSearchBox";
import HomePage from './components/home-page'

export default function DFDAPage() {
    return (
        <div className="">
            <HomePage />
            {/* <TreatmentConditionSearchBox />
            <FindTreatments />
            <HealthTrackingLinkBoxes />
            <CostBenefitAnalysis />
            <TopTreatments /> */}
        </div>
    )
}