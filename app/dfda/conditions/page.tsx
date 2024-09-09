import React from 'react'
import Link from 'next/link'
import { fetchConditions } from '../dfdaActions'

export default async function ConditionListPage() {
    const conditions = await fetchConditions()
    const sortedConditions = conditions.sort((a, b) => b.numberOfTreatments - a.numberOfTreatments)

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-2xl font-bold">Conditions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedConditions.map((condition) => (
                    <Link href={`/dfda/conditions/${condition.name}`} key={condition.id}>
                        <div className="card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-lg font-semibold">{condition.name}</h2>
                            <span className="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full bg-opacity-20">
                                {condition.numberOfTreatments} Treatments
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}