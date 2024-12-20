'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { PhoneNumberInput } from "./PhoneNumberInput"
import { createPerson } from "../actions"

interface PersonSetupFormProps {
  isLoggedIn: boolean
}

export function PersonSetupForm({ isLoggedIn }: PersonSetupFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'details'>('phone')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handlePhoneSuccess = (number: string) => {
    setPhoneNumber(number)
    setStep('details')
  }

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const person = await createPerson({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phoneNumber: phoneNumber
      })
      
      toast.success("Recipient added successfully")
      router.push(`/phone-friend/recipients/${person.id}/settings`)
    } catch (error) {
      toast.error("Failed to save recipient details")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in to Get Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Please sign in to set up daily check-in calls for your loved one.
          </p>
          <PhoneNumberInput isLoggedIn={false} />
        </CardContent>
      </Card>
    )
  }

  if (step === 'phone') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enter Their Phone Number</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            First, enter the phone number of the person who will receive the daily check-in calls.
          </p>
          <PhoneNumberInput 
            isLoggedIn={true}
            onSuccess={handlePhoneSuccess}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Their Name"
              name="name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Their Email (optional)"
              name="email"
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue to Schedule Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 