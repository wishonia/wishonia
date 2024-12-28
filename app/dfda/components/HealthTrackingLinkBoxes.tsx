import { Clipboard, Database } from 'lucide-react'
import React from 'react'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function HealthTrackingLinkBoxes() {
    const handleStartLogging = () => {
        console.log('Start logging')
        // Implement logging functionality here
    }

    const handleConnectData = () => {
        console.log('Connect data')
        // Implement data connection functionality here
    }

    return (
        <section className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Record Symptoms and Food & Drug Intake</CardTitle>
                    <CardDescription>
                        This will enable us to determine the safety and efficacy.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleStartLogging}>
                        <Clipboard className="mr-2 h-4 w-4" /> Start Logging
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Import Your Health Data
                    </CardTitle>
                    <CardDescription>
                        Securely import health data from various apps and devices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleConnectData}>
                        <Database className="mr-2 h-4 w-4" /> Connect Data
                    </Button>
                </CardContent>
            </Card>
        </section>
    )
}