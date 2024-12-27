"use client"

import { Session } from "next-auth"
import { useEffect, useState } from "react"

import { LoginPromptButton } from "@/components/LoginPromptButton"
import { TrackingReminderNotification } from "@/types/models/TrackingReminderNotification"

import {
  getTrackingReminderNotifications,
  skipAllNotifications,
  skipNotification,
  snoozeNotification,
  trackAllNotifications,
  trackNotification,
} from "../../dfdaActions"

interface NotificationDivider {
  name: string
  trackingReminderNotifications: TrackingReminderNotification[]
}

export function ReminderInbox({
  userId,
  session,
}: {
  userId: string | undefined
  session: Session | null
}) {
  const [notifications, setNotifications] = useState<
    TrackingReminderNotification[]
  >([])
  const [dividers, setDividers] = useState<NotificationDivider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  const fetchNotifications = async (noCache = false) => {
    if (!userId) {
      setError("Please log in to view notifications")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getTrackingReminderNotifications(userId)
      setNotifications(data)

      // Group notifications by day
      const groups = data.reduce(
        (acc: Record<string, TrackingReminderNotification[]>, notification) => {
          const day = new Date(
            notification.notifiedAt || ""
          ).toLocaleDateString()
          if (!acc[day]) acc[day] = []
          acc[day].push(notification)
          return acc
        },
        {}
      )

      const newDividers = Object.entries(groups).map(([name, items]) => ({
        name,
        trackingReminderNotifications: items,
      }))

      setDividers(newDividers)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError("Failed to load reminders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId])

  const handleSkip = async (notification: TrackingReminderNotification) => {
    if (!userId) return
    try {
      await skipNotification(notification, userId)
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    } catch (error) {
      console.error("Failed to skip notification:", error)
    }
  }

  const handleSnooze = async (notification: TrackingReminderNotification) => {
    if (!userId) return
    try {
      await snoozeNotification(notification, userId)
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    } catch (error) {
      console.error("Failed to snooze notification:", error)
    }
  }

  const handleTrack = async (
    notification: TrackingReminderNotification,
    value?: number
  ) => {
    if (!userId) return
    try {
      const trackValue = value ?? notification.modifiedValue
      if (typeof trackValue !== "number") {
        console.error("No valid value to track")
        return
      }

      await trackNotification(notification, userId, trackValue)
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))

      if (
        notifications.filter((n) => n.variableId === notification.variableId)
          .length > 1
      ) {
        const confirmed = window.confirm(
          `Want to record ${trackValue} ${notification.unitAbbreviatedName} for ALL remaining ${notification.variableName} notifications?`
        )
        if (confirmed) {
          await handleTrackAll(notification, trackValue)
        }
      }
    } catch (error) {
      console.error("Failed to track notification:", error)
    }
  }

  const handleTrackAll = async (
    notification: TrackingReminderNotification,
    value: number
  ) => {
    if (!userId) return
    try {
      await trackAllNotifications(notification, userId, value)
      setNotifications((prev) =>
        prev.filter((n) => n.variableId !== notification.variableId)
      )
    } catch (error) {
      console.error("Failed to track all notifications:", error)
    }
  }

  const handleSkipAll = async (notification: TrackingReminderNotification) => {
    if (!userId) return
    try {
      await skipAllNotifications(notification, userId)
      setNotifications((prev) =>
        prev.filter((n) => n.variableId !== notification.variableId)
      )
    } catch (error) {
      console.error("Failed to skip all notifications:", error)
    }
  }

  const handleActionClick = async (
    action: any,
    notification: TrackingReminderNotification
  ) => {
    if (action.callback.includes("track")) {
      await handleTrack(notification, action.modifiedValue)
    }
  }

  const handleSettings = (notification: TrackingReminderNotification) => {
    console.log("Settings:", notification)
  }

  if (!userId) {
    return (
      <div className="p-6 text-center">
        <h2 className="mb-4 text-xl">Please sign in to view your reminders</h2>
        <LoginPromptButton
          buttonText="Sign in to view reminders"
          buttonVariant="default"
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-red-500">{error}</div>
        {!userId && (
          <LoginPromptButton
            buttonText="Sign in to view reminders"
            buttonVariant="default"
          />
        )}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="list card rounded-lg bg-white p-6 shadow">
        {userId ? (
          <div className="text-center">
            <p className="mb-4 text-2xl">All caught up!</p>
            <div className="mb-4 text-6xl">☀️</div>
            <div className="space-y-4">
              <button className="w-full rounded-full bg-pink-500 px-6 py-2 text-white transition-colors hover:bg-pink-600">
                <i className="mr-2" />
                Add a reminder
              </button>
              <button className="w-full rounded-full px-6 py-2 text-purple-500 transition-colors hover:bg-purple-50">
                <i className="mr-2">📝</i>
                Record a measurement
              </button>
              <button className="w-full rounded-full px-6 py-2 text-blue-500 transition-colors hover:bg-blue-50">
                <i className="mr-2">📋</i>
                History
              </button>
              <button
                onClick={() => fetchNotifications(true)}
                className="w-full rounded-full px-6 py-2 text-green-500 transition-colors hover:bg-green-50"
              >
                <i className="mr-2">🔄</i>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl">Sign in to view your reminders</p>
            <LoginPromptButton buttonText="Sign in" buttonVariant="default" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {dividers.map((divider, dividerIndex) => (
        <div
          key={divider.name}
          className="list card rounded-lg bg-white shadow"
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">{divider.name}</h2>
            <button
              onClick={() => fetchNotifications(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              <i className="mr-1">🔄</i>
              Refresh
            </button>
          </div>

          {divider.trackingReminderNotifications.map((notification, index) => (
            <div key={notification.id} className="border-b p-4 last:border-b-0">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0">
                  {notification.pngUrl ? (
                    <img
                      src={notification.pngUrl}
                      alt={notification.title || ""}
                      className="h-10 w-10 object-contain"
                    />
                  ) : notification.ionIcon ? (
                    <i className="text-4xl text-blue-500">
                      {notification.ionIcon}
                    </i>
                  ) : (
                    <i className="text-4xl text-blue-500">📊</i>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {notification.title || notification.variableName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {notification.trackingReminderNotificationTimeLocalHumanString ||
                      new Date(notification.notifiedAt || "").toLocaleString()}
                  </p>
                </div>

                <button
                  className="p-2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    console.log("Show action sheet for:", notification)
                  }}
                >
                  <i className="ion-more text-xl">⋮</i>
                </button>
              </div>

              <div className="mt-4 flex gap-2 text-sm">
                <button
                  onClick={() => handleSkip(notification)}
                  className="flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-red-500 hover:bg-red-50"
                >
                  <i className="ion-android-cancel">✕</i>
                  <span>Skip</span>
                </button>

                {notification.unitAbbreviatedName !== "/5" && (
                  <button
                    onClick={() => handleSnooze(notification)}
                    className="flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-purple-500 hover:bg-purple-50"
                  >
                    <i className="ion-android-notifications-off">⏰</i>
                    <span>Snooze</span>
                  </button>
                )}

                <button
                  onClick={() => handleSettings(notification)}
                  className="flex flex-1 items-center justify-center gap-1 rounded px-3 py-2 text-blue-500 hover:bg-blue-50"
                >
                  <i className="ion-settings">⚙️</i>
                  <span>Settings</span>
                </button>
              </div>

              {notification.inputType === "value" && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-3">
                    <label className="flex items-center gap-2">
                      Enter Value
                      <input
                        type="number"
                        className="max-w-[100px] rounded border-2 border-red-500 px-3 py-2 text-center"
                        placeholder="Value"
                        value={notification.modifiedValue}
                        onChange={(e) => {
                          console.log("Value changed:", e.target.value)
                        }}
                      />
                      <span className="text-gray-600">
                        {notification.unitAbbreviatedName}
                      </span>
                    </label>
                    <button
                      className="flex items-center gap-1 rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                      onClick={() =>
                        handleTrack(notification, notification.modifiedValue)
                      }
                    >
                      <i className="ion-checkmark-round">✓</i>
                      <span className="hidden sm:inline">Record</span>
                    </button>
                  </div>
                </div>
              )}

              {notification.actionArray?.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {notification.actionArray.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={() => handleActionClick(action, notification)}
                        title={action.longTitle}
                      >
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
