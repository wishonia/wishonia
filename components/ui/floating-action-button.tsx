"use client"

import { Bell, PlusCircle, Upload, HelpCircle, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"

interface ActionItem {
  label: string
  icon: React.ReactNode
  href: string
}

const actionItems: ActionItem[] = [
  {
    label: "Add a Reminder",
    icon: <Bell className="h-5 w-5" />,
    href: "/dfda/reminders/add",
  },
  {
    label: "Record a Measurement",
    icon: <PlusCircle className="h-5 w-5" />,
    href: "/dfda/safe/measurements/add",
  },
  {
    label: "Import Data",
    icon: <Upload className="h-5 w-5" />,
    href: "/dfda/import",
  },
  {
    label: "Get Help",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/help",
  },
]

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end gap-2">
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {actionItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white",
                "transform transition-all duration-200 hover:bg-red-700",
                "shadow-lg"
              )}
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-red-600",
          "transform transition-all duration-200 hover:bg-red-700",
          "shadow-lg"
        )}
      >
        {isExpanded ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <PlusCircle className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  )
} 