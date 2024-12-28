"use client"

import { EmailFrequency } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface NotificationSettingsProps {
  petitionId: string
  initialSettings?: {
    notifyOnComment: boolean
    notifyOnMilestone: boolean
    notifyOnUpdate: boolean
    notifyOnSignature: boolean
    emailFrequency: EmailFrequency
  }
  onUpdate: (
    petitionId: string,
    settings: {
      notifyOnComment: boolean
      notifyOnMilestone: boolean
      notifyOnUpdate: boolean
      notifyOnSignature: boolean
      emailFrequency: EmailFrequency
    }
  ) => Promise<void>
}

export function NotificationSettings({
  petitionId,
  initialSettings,
  onUpdate,
}: NotificationSettingsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [notifications, setNotifications] = useState(
    initialSettings
      ? initialSettings.notifyOnComment &&
          initialSettings.notifyOnMilestone &&
          initialSettings.notifyOnUpdate &&
          initialSettings.notifyOnSignature
      : true
  )

  const [emailFrequency, setEmailFrequency] = useState<EmailFrequency>(
    initialSettings?.emailFrequency || "INSTANT"
  )

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await onUpdate(petitionId, {
        notifyOnComment: notifications,
        notifyOnMilestone: notifications,
        notifyOnUpdate: notifications,
        notifyOnSignature: notifications,
        emailFrequency,
      })
      toast({
        title: "Success",
        description: "Notification settings updated",
      })
    } catch (error) {
      console.error("Failed to update notification settings:", error)
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-semibold">Notification Settings</h3>

      <div className="flex items-center justify-between">
        <label className="font-medium">Notifications</label>
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </div>

      {notifications && (
        <div className="flex items-center justify-between">
          <label className="font-medium">Email Frequency</label>
          <Select
            value={emailFrequency}
            onValueChange={(value: EmailFrequency) => setEmailFrequency(value)}
          >
            <option value="INSTANT">Instant</option>
            <option value="DAILY">Daily Digest</option>
            <option value="WEEKLY">Weekly Digest</option>
          </Select>
        </div>
      )}

      <Button onClick={handleUpdate} disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  )
}
