'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { savePhoneNumber, initiateCall } from "../actions"
import { toast } from "sonner"

interface PhoneNumberInputProps {
  isLoggedIn: boolean
}

function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // For US numbers, ensure 10 digits and add +1 prefix
  if (digits.length === 10) {
    return `+1${digits}`
  }
  
  // If already has country code (11+ digits), just add +
  if (digits.length >= 11) {
    return `+${digits}`
  }
  
  return digits
}

function formatPhoneNumberForDisplay(value: string): string {
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 3) {
    return digits
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function PhoneNumberInput({ isLoggedIn }: PhoneNumberInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [displayValue, setDisplayValue] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumberForDisplay(input)
    setDisplayValue(formatted)
    setPhoneNumber(formatPhoneNumber(input))
  }

  async function handleSubmit(formData: FormData) {
    // Validate phone number format
    const phone = formatPhoneNumber(phoneNumber)
    if (!phone.match(/^\+1\d{10}$/)) {
      toast.error("Please enter a valid 10-digit US phone number")
      return
    }

    try {
      setIsSubmitting(true)
      
      // Create new FormData with formatted phone number
      const newFormData = new FormData()
      newFormData.set('phone', phone)
      
      // First save the phone number
      await savePhoneNumber(newFormData)
      
      // Then initiate the call
      const result = await initiateCall()
      
      if (result.success) {
        toast.success("Call initiated successfully!")
      } else {
        toast.error(result.error || "Failed to initiate call")
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return isLoggedIn ? (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          name="phone"
          placeholder="(555) 555-5555"
          type="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          required
          disabled={isSubmitting}
          maxLength={14} // (XXX) XXX-XXXX
          className="text-lg"
        />
        <p className="text-sm text-muted-foreground">
          Enter your US phone number. We'll format it automatically.
        </p>
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !phoneNumber.match(/^\+1\d{10}$/)}
      >
        {isSubmitting ? "Starting Call..." : "Start Your Free Trial"}
      </Button>
      {phoneNumber && !phoneNumber.match(/^\+1\d{10}$/) && (
        <p className="text-sm text-destructive">
          Please enter a complete 10-digit US phone number
        </p>
      )}
    </form>
  ) : (
    <div className="space-y-4">
      <Input
        name="phone"
        placeholder="(555) 555-5555"
        type="tel"
        disabled
      />
      <LoginPromptButton 
        buttonText="Sign in to Start Free Trial"
        buttonVariant="default"
        buttonSize="lg"
      />
    </div>
  )
} 