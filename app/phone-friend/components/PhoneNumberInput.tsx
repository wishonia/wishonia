'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { savePhoneNumber } from "../actions"

interface PhoneNumberInputProps {
  isLoggedIn: boolean
}

export function PhoneNumberInput({ isLoggedIn }: PhoneNumberInputProps) {
  return isLoggedIn ? (
    <form action={savePhoneNumber} className="space-y-4">
      <Input
        name="phone"
        placeholder="Enter Your Phone Number"
        type="tel"
        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
        required
      />
      <Button type="submit" className="w-full">Start Your Free Trial</Button>
    </form>
  ) : (
    <div className="space-y-4">
      <Input
        name="phone"
        placeholder="Enter Your Phone Number"
        type="tel"
        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
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