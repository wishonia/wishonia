"use client"
import React from 'react'
import { fetchConditions } from '../dfdaActions'
export default async function ConditionListPage() {

    const conditions = await fetchConditions()
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-2xl font-bold">Conditions</h1>
            <ul>
                {conditions.map((condition) => (
                    <li key={condition.id}>{condition.name}</li>
                ))}
            </ul>
        </div>
    )
}