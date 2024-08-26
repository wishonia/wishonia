import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BarChart2 } from 'lucide-react'

export default function TopTreatments() {
    const [condition, setCondition] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        if (condition.length > 2) {
            fetch(`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${condition}&ef=name`)
                .then(response => response.json())
                .then(data => {
                    // Extract the suggestions from the fourth element of the array
                    const extractedSuggestions = data[3].map((item: string[]) => item[0]);
                    setSuggestions(extractedSuggestions);
                    setShowDropdown(true);
                })
        } else {
            setSuggestions([])
            setShowDropdown(false)
        }
    }, [condition])

    const handleViewRankings = (e: React.FormEvent, selectedCondition?: string) => {
        e.preventDefault()
        const conditionToUse = selectedCondition || condition
        console.log('Viewing rankings for:', conditionToUse)
        // Implement rankings view functionality here
    }

    const handleSuggestionClick = (suggestion: string) => {
        setCondition(suggestion)
        setShowDropdown(false)
        handleViewRankings({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>, suggestion)
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>See Top Treatments</CardTitle>
                    <CardDescription>
                        View a ranked list of the most effective treatments for a your condition
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleViewRankings(e)} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative flex-grow">
                            <Input
                                type="text"
                                placeholder="Enter medical condition"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full"
                            />
                            {showDropdown && suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full border border-gray-300 mt-1 max-h-60 overflow-auto bg-background">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">
                            <BarChart2 className="mr-2 h-4 w-4" /> View Rankings
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    )
}