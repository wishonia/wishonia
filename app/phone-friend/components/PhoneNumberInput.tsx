'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface PhoneNumberInputProps {
  isLoggedIn: boolean
  onSuccess?: (phoneNumber: string) => void
}

export function PhoneNumberInput({ isLoggedIn, onSuccess }: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically validate and save the phone number
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (onSuccess) {
        onSuccess(phoneNumber)
      }
      
      toast.success("Phone number saved successfully")
    } catch (error) {
      toast.error("Failed to save phone number")
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