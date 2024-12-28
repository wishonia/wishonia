'use client'

import { useRouter } from 'next/navigation'
import { Session } from "next-auth"
import { useState } from 'react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PhoneNumberInputProps {
  session: Session | null
  onSuccess?: (phoneNumber: string) => void
}

export function DemoPhoneNumberInput({ session, onSuccess }: PhoneNumberInputProps) {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically validate and save the phone number
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (onSuccess) {
        onSuccess(phoneNumber)
      }
      
      // Redirect to new schedule page with phone number
      const formattedPhone = encodeURIComponent(phoneNumber)
      router.push(`/call-scheduler/schedules/new?phone=${formattedPhone}`)
      
      toast.success("Continuing to schedule setup...")
    } catch (error) {
      toast.error("Failed to continue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="tel"
        inputMode="tel"
        placeholder="(555) 555-5555"
        pattern="[\d\s()-]+"
        title="Please enter a valid phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        aria-label="Phone number"
        autoComplete="tel"
      />
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </Button>
    </form>
  )
} 