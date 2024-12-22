'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createPerson, createCallSchedule } from "../actions"
import { Agent } from "@prisma/client"

const PRESET_TIMES = [
  { value: '09:00', label: '9:00 AM - Morning Check-in' },
  { value: '12:00', label: '12:00 PM - Lunch Time Check-in' },
  { value: '17:00', label: '5:00 PM - Evening Check-in' },
  { value: '20:00', label: '8:00 PM - Night Check-in' },
  { value: 'custom', label: 'Custom Time' }
]

interface NewScheduleFormProps {
  agents: Agent[]
  initialPhoneNumber?: string
}

export function NewScheduleForm({ agents, initialPhoneNumber = '' }: NewScheduleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTime, setSelectedTime] = useState(PRESET_TIMES[0].value)
  const [customTime, setCustomTime] = useState('')
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || '')
  const [recipientDetails, setRecipientDetails] = useState({
    name: '',
    phoneNumber: initialPhoneNumber,
    email: ''
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First create or get the person
      const person = await createPerson({
        name: recipientDetails.name,
        phoneNumber: recipientDetails.phoneNumber,
        email: recipientDetails.email || undefined
      })

      // Then create the schedule
      const formData = new FormData()
      formData.append('time', selectedTime === 'custom' ? customTime : selectedTime)
      formData.append('personId', person.id)
      formData.append('agentId', selectedAgent)

      await createCallSchedule(formData)
      
      toast.success("Schedule created successfully")
      router.push('/call-scheduler/schedules')
    } catch (error) {
      toast.error("Failed to create schedule")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Recipient Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recipient Details</h3>
        <Input
          placeholder="Their Name"
          value={recipientDetails.name}
          onChange={(e) => setRecipientDetails(prev => ({ ...prev, name: e.target.value }))}
          required
          disabled={isSubmitting}
          type="text"
          autoComplete="name"
        />
        <Input
          type="tel"
          placeholder="(555) 555-5555"
          value={recipientDetails.phoneNumber}
          onChange={(e) => setRecipientDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
          required
          disabled={isSubmitting}
          pattern="[\d\s()-]+"
          title="Please enter a valid phone number"
          inputMode="tel"
          autoComplete="tel"
          aria-label="Phone number"
        />
        <Input
          type="email"
          placeholder="their.email@example.com"
          value={recipientDetails.email}
          onChange={(e) => setRecipientDetails(prev => ({ ...prev, email: e.target.value }))}
          disabled={isSubmitting}
          inputMode="email"
          autoComplete="email"
          aria-label="Email address"
        />
      </div>

      {/* Schedule Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Call Schedule</h3>
        <RadioGroup
          value={selectedTime}
          onValueChange={setSelectedTime}
          className="space-y-2"
        >
          {PRESET_TIMES.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>

        {selectedTime === 'custom' && (
          <div className="pl-6 pt-2">
            <Input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              required={selectedTime === 'custom'}
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Select AI Assistant</Label>
          <Select 
            value={selectedAgent}
            onValueChange={setSelectedAgent}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an assistant" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !recipientDetails.name || !recipientDetails.phoneNumber || !selectedAgent || (selectedTime === 'custom' && !customTime)}
      >
        {isSubmitting ? 'Creating Schedule...' : 'Create Schedule'}
      </Button>
    </form>
  )
} 