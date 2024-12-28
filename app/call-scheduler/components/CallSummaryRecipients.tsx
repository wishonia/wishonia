'use client'

import { useState } from 'react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface Recipient {
  id: string
  name: string
  email?: string
  phoneNumber?: string
  notifyBy: string[]
}

interface CallSummaryRecipientsProps {
  recipients: Recipient[]
  onAddRecipient: (recipient: Omit<Recipient, 'id'>) => Promise<void>
  onRemoveRecipient: (id: string) => Promise<void>
}

export function CallSummaryRecipients({
  recipients,
  onAddRecipient,
  onRemoveRecipient
}: CallSummaryRecipientsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    notifyBy: ['EMAIL']
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setIsAdding(true)
      await onAddRecipient(newRecipient)
      setNewRecipient({ name: '', email: '', phoneNumber: '', notifyBy: ['EMAIL'] })
      toast.success("Recipient added successfully!")
    } catch (error) {
      toast.error("Failed to add recipient")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Call Summary Recipients</h3>
      
      <div className="space-y-2">
        {recipients.map((recipient) => (
          <div key={recipient.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-medium">{recipient.name}</p>
              <p className="text-sm text-muted-foreground">
                {recipient.email} {recipient.phoneNumber}
              </p>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onRemoveRecipient(recipient.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Name"
          value={newRecipient.name}
          onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={newRecipient.email}
          onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={newRecipient.phoneNumber}
          onChange={(e) => setNewRecipient(prev => ({ ...prev, phoneNumber: e.target.value }))}
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="notify-email"
            checked={newRecipient.notifyBy.includes('EMAIL')}
            onCheckedChange={(checked) => {
              setNewRecipient(prev => ({
                ...prev,
                notifyBy: checked 
                  ? [...prev.notifyBy, 'EMAIL']
                  : prev.notifyBy.filter(m => m !== 'EMAIL')
              }))
            }}
          />
          <label htmlFor="notify-email">Notify by email</label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="notify-sms"
            checked={newRecipient.notifyBy.includes('SMS')}
            onCheckedChange={(checked) => {
              setNewRecipient(prev => ({
                ...prev,
                notifyBy: checked
                  ? [...prev.notifyBy, 'SMS']
                  : prev.notifyBy.filter(m => m !== 'SMS')
              }))
            }}
          />
          <label htmlFor="notify-sms">Notify by SMS</label>
        </div>

        <Button 
          type="submit" 
          disabled={isAdding}
          className="w-full"
        >
          {isAdding ? "Adding..." : "Add Recipient"}
        </Button>
      </form>
    </div>
  )
} 