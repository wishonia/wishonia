import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react'

export default function FindTreatments() {
    const [condition, setCondition] = useState('')

    const handleConditionSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Searching for:', condition)
        // Implement search functionality here
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>Find Treatments & Join Trials</CardTitle>
                    <CardDescription>Search for treatments and clinical trials related to your condition</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleConditionSearch} className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter medical condition"
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}