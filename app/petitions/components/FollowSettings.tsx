'use client'

import { EmailFrequency } from "@prisma/client"
import { useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { updateFollowSettings } from '../petitionActions'

interface FollowSettings {
  notifyOnComment: boolean
  notifyOnMilestone: boolean
  notifyOnUpdate: boolean
  notifyOnSignature: boolean
  emailFrequency: EmailFrequency
}

export function FollowSettings({ 
  petitionId,
  initialSettings
}: { 
  petitionId: string
  initialSettings: FollowSettings
}) {
  const [settings, setSettings] = useState(initialSettings)

  const updateSetting = async (key: keyof FollowSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    await updateFollowSettings(petitionId, newSettings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Email Frequency</h3>
        <Select
          value={settings.emailFrequency}
          onValueChange={(value) => updateSetting('emailFrequency', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INSTANT">Instant</SelectItem>
            <SelectItem value="DAILY">Daily Summary</SelectItem>
            <SelectItem value="WEEKLY">Weekly Summary</SelectItem>
            <SelectItem value="NEVER">Never</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-4">Notification Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label>Comments</label>
            <Switch 
              checked={settings.notifyOnComment}
              onCheckedChange={(checked) => updateSetting('notifyOnComment', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label>Milestones</label>
            <Switch 
              checked={settings.notifyOnMilestone}
              onCheckedChange={(checked) => updateSetting('notifyOnMilestone', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label>Status Updates</label>
            <Switch 
              checked={settings.notifyOnUpdate}
              onCheckedChange={(checked) => updateSetting('notifyOnUpdate', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label>New Signatures</label>
            <Switch 
              checked={settings.notifyOnSignature}
              onCheckedChange={(checked) => updateSetting('notifyOnSignature', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 