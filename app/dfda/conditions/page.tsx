import Link from 'next/link'
import React from 'react'


import { DFDABreadcrumbs } from '@/components/Breadcrumbs/DFDABreadcrumbs'

import ConditionSearchSection from '../components/ConditionSearchSection'
import { fetchConditions } from '../dfdaActions'

export default async function ConditionListPage() {
    const conditions = await fetchConditions()
    const sortedConditions = conditions.sort((a, b) => b.numberOfTreatments - a.numberOfTreatments)

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <DFDABreadcrumbs />
            <div className="neobrutalist-gradient-container neobrutalist-gradient-pink">
                <h1 className="neobrutalist-title text-white">Conditions</h1>
                <ConditionSearchSection />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedConditions.map((condition) => (
                    <Link href={`/dfda/conditions/${condition.name}`} key={condition.id}>
                        <div className="neobrutalist-container hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            <h2 className="text-lg font-black">{condition.name}</h2>
                            <span className="inline-block mt-2 text-xs font-black px-3 py-1 rounded-full bg-[#FF3366] text-white">
                                {condition.numberOfTreatments} Treatments
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}