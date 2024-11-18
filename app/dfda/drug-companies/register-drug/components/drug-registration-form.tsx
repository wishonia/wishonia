'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'

const steps = [
  "Basic Information",
  "Documentation",
  "AI-Generated Protocols",
  "Review & Submit"
]

export default function DrugRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    drugName: '',
    drugCode: '',
    chemicalComposition: '',
    proposedIndications: '',
    developmentPhase: '',
    targetPopulation: '',
    knownSideEffects: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, steps.length - 1))
  }

  const handlePrevStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 0))
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Register New Drug for Clinical Trials</CardTitle>
          <CardDescription>Complete the following steps to register your drug in the decentralized clinical trial system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Tabs value={steps[currentStep]} className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
                {steps.map((step, index) => (
                  <TabsTrigger
                    key={step}
                    value={step}
                    onClick={() => setCurrentStep(index)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-auto py-2"
                  >
                    {index + 1}. {step}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drugName">Drug Name</Label>
                  <Input
                    id="drugName"
                    name="drugName"
                    value={formData.drugName}
                    onChange={handleInputChange}
                    placeholder="Enter drug name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drugCode">Drug Code</Label>
                  <Input
                    id="drugCode"
                    name="drugCode"
                    value={formData.drugCode}
                    onChange={handleInputChange}
                    placeholder="Enter drug code"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chemicalComposition">Chemical Composition</Label>
                <Textarea
                  id="chemicalComposition"
                  name="chemicalComposition"
                  value={formData.chemicalComposition}
                  onChange={handleInputChange}
                  placeholder="Enter chemical composition"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proposedIndications">Proposed Indication(s)</Label>
                <Textarea
                  id="proposedIndications"
                  name="proposedIndications"
                  value={formData.proposedIndications}
                  onChange={handleInputChange}
                  placeholder="Enter proposed indications"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developmentPhase">Current Development Phase</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('developmentPhase', value)}
                  value={formData.developmentPhase}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select development phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preclinical">Preclinical</SelectItem>
                    <SelectItem value="phase1">Phase 1</SelectItem>
                    <SelectItem value="phase2">Phase 2</SelectItem>
                    <SelectItem value="phase3">Phase 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetPopulation">Target Patient Population</Label>
                <Input
                  id="targetPopulation"
                  name="targetPopulation"
                  value={formData.targetPopulation}
                  onChange={handleInputChange}
                  placeholder="Describe target patient population"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="knownSideEffects">Known Side Effects</Label>
                <Textarea
                  id="knownSideEffects"
                  name="knownSideEffects"
                  value={formData.knownSideEffects}
                  onChange={handleInputChange}
                  placeholder="List known side effects from preclinical studies"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Relevant Documentation</Label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {['Preclinical Study Results', 'Manufacturing Details', 'Existing Safety Data'].map((doc) => (
                    <div key={doc} className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm font-medium">{doc}</p>
                      <p className="mt-1 text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Upload File
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">AI-Generated Protocols</h3>
                    <div className="mt-2 text-sm">
                      <p>The system has generated proposed study protocols based on the information provided. Please review the following:</p>
                      <ul className="list-disc pl-5 pt-2">
                        <li>Proposed study protocols for different phases</li>
                        <li>Inclusion/exclusion criteria for participants</li>
                        <li>Required lab tests and clinical procedures</li>
                        <li>Data collection methods and frequency</li>
                        <li>Statistical analysis plan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-muted-foreground">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Review Required</h3>
                    <div className="mt-2 text-sm">
                      <p>Please carefully review the AI-generated protocols. You can make minor adjustments if necessary before proceeding to the next step.</p>
                    </div>
                  </div>
                </div>
              </div>
              <Textarea
                placeholder="Enter any comments or requested adjustments here..."
                rows={5}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
                <h3 className="text-lg font-medium">Review & Submit</h3>
                <p className="mt-2 text-sm">Please review all the information you've provided. Once you submit, the system will:</p>
                <ul className="list-disc pl-5 pt-2 text-sm">
                  <li>Automatically submit for regulatory review</li>
                  <li>Begin recruiting participants based on the criteria</li>
                  <li>Schedule necessary lab tests and procedures</li>
                </ul>
                <p className="mt-4 text-sm font-medium">Are you ready to submit your drug for clinical trials?</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handlePrevStep} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
            {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}