"use client"

import { useState } from "react"

import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

import {
  unsubscribeFromAll,
  updateUserEmailSettings,
} from "../notificationSettingsActions"

interface Props {
  userEmail: string | null
  marketingEmails: boolean
  newsletterEmails: boolean
  unsubscribeFromAll: boolean
}

export function NotificationPreferences({
  userEmail,
  marketingEmails: initialMarketing,
  newsletterEmails: initialNewsletter,
  unsubscribeFromAll: initialUnsubscribe,
}: Props) {
  const [settings, setSettings] = useState({
    marketingEmails: initialMarketing,
    newsletterEmails: initialNewsletter,
    unsubscribeFromAll: initialUnsubscribe,
  })
  const [saving, setSaving] = useState(false)

  async function handleToggle(key: "marketingEmails" | "newsletterEmails") {
    if (settings.unsubscribeFromAll) {
      toast({ description: "You are unsubscribed from all emails", variant: "destructive" })
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
      toast({ description: "Settings updated" })
    } catch (error) {
      toast({ description: "Failed to update settings", variant: "destructive" })
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnsubscribeAll() {
    setSaving(true)
    try {
      await unsubscribeFromAll()
      setSettings({
        marketingEmails: false,
        newsletterEmails: false,
        unsubscribeFromAll: true,
      })
      toast({ description: "Unsubscribed from all emails" })
    } catch (error) {
      toast({ description: "Failed to unsubscribe", variant: "destructive" })
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (!userEmail) {
    return (
      <div className="rounded-lg p-4">
        <p className="">
          Add an email address to your account to receive notifications.
        </p>
      </div>
    )
  }

  if (settings.unsubscribeFromAll) {
    return (
      <div className="rounded-lg  p-4">
        <p className="">
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
