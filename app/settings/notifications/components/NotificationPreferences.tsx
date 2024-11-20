"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"

import {
  unsubscribeFromAll,
  updateUserEmailSettings,
} from "../notificationSettingsActions"

interface Props {
  userEmail: string | null
  marketingEmails: boolean
  newsletterEmails: boolean
  unsubscribeFromAll: boolean
  userId: string
}

export function NotificationPreferences({
  userEmail,
  marketingEmails: initialMarketing,
  newsletterEmails: initialNewsletter,
  unsubscribeFromAll: initialUnsubscribe,
  userId,
}: Props) {
  const [settings, setSettings] = useState({
    marketingEmails: initialMarketing,
    newsletterEmails: initialNewsletter,
    unsubscribeFromAll: initialUnsubscribe,
  })
  const [saving, setSaving] = useState(false)

  async function handleToggle(key: "marketingEmails" | "newsletterEmails") {
    if (settings.unsubscribeFromAll) {
      toast.error("You are unsubscribed from all emails")
      return
    }

    setSaving(true)
    try {
      const newSettings = {
        ...settings,
        [key]: !settings[key],
      }

      await updateUserEmailSettings({
        marketingEmails: newSettings.marketingEmails,
        newsletterEmails: newSettings.newsletterEmails,
      })
      setSettings(newSettings)
      toast.success("Settings updated")
    } catch (error) {
      toast.error("Failed to update settings")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnsubscribeAll() {
    setSaving(true)
    try {
      await unsubscribeFromAll(userId)
      setSettings({
        marketingEmails: false,
        newsletterEmails: false,
        unsubscribeFromAll: true,
      })
      toast.success("Unsubscribed from all emails")
    } catch (error) {
      toast.error("Failed to unsubscribe")
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (!userEmail) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4">
        <p className="text-yellow-800">
          Add an email address to your account to receive notifications.
        </p>
      </div>
    )
  }

  if (settings.unsubscribeFromAll) {
    return (
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-gray-800">
          You are currently unsubscribed from all emails. Contact support if
          you'd like to resubscribe.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="font-semibold">Email Preferences</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-500">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle("marketingEmails")}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Newsletter</p>
              <p className="text-sm text-gray-500">
                Receive our weekly newsletter
              </p>
            </div>
            <Switch
              checked={settings.newsletterEmails}
              onCheckedChange={() => handleToggle("newsletterEmails")}
              disabled={saving}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <button
          onClick={handleUnsubscribeAll}
          className="text-sm text-red-600 hover:text-red-800"
          disabled={saving}
        >
          Unsubscribe from all emails
        </button>
      </div>
    </div>
  )
}
