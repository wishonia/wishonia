'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createCallSchedule } from "../actions"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Agent {
  id: string
  name: string
  avatar?: string | null
}

interface CallScheduleFormProps {
  personId: string
  agents: Agent[]
  defaultAgentId: string
}

const PRESET_TIMES = [
  { value: '09:00', label: '9:00 AM - Morning Check-in' },
  { value: '12:00', label: '12:00 PM - Lunch Time Check-in' },
  { value: '17:00', label: '5:00 PM - Evening Check-in' },
  { value: '20:00', label: '8:00 PM - Night Check-in' },
  { value: 'custom', label: 'Custom Time' }
]

export function CallScheduleForm({ personId, agents, defaultAgentId }: CallScheduleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(defaultAgentId)
  const [selectedTime, setSelectedTime] = useState(PRESET_TIMES[0].value)
  const [customTime, setCustomTime] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const time = selectedTime === 'custom' ? customTime : selectedTime
      const [hours, minutes] = time.split(':')
      const timeStr = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes))
        .toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit'
        })
      
      formData.append('name', `Daily Check-in at ${timeStr}`)
      formData.append('time', time)
      formData.append('personId', personId)
      formData.append('agentId', selectedAgent)
      
      await createCallSchedule(formData)
      toast.success("Schedule created successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to create schedule")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>When should we call?</Label>
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
      </div>

      <div>
        <Label>Which AI agent should make the call?</Label>
        <Select 
          value={selectedAgent} 
          onValueChange={setSelectedAgent}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select an Agent" />
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

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !selectedAgent || (selectedTime === 'custom' && !customTime)}
      >
        {isSubmitting ? 'Creating Schedule...' : 'Create Schedule'}
      </Button>
    </form>
  )
} 