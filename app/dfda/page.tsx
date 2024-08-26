"use client"
import React from 'react'
import FindTreatments from './components/FindTreatments'
import HealthTracking from './components/HealthTracking'
import CostBenefitAnalysis from './components/CostBenefitAnalysis'
import TopTreatments from './components/TopTreatments'

export default function DFDAPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
                <FindTreatments />
                <HealthTracking />
                <CostBenefitAnalysis />
                <TopTreatments />
        </div>
    )
}