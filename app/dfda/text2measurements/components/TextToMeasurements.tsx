'use client'

import React, { useState } from "react"
import { getTimeZoneOffset, getUtcDateTime } from "@/lib/dateTimeWithTimezone"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { SpinningLoader } from "@/components/spinningLoader"

// Define a type for the message objects
type Message = {
  type: "user" | "response" | "loading"
  text: string
}

export function TextToMeasurements() {
  const [input, setInput] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { type: "user", text: input },
        { type: "loading", text: "Loading..." },
      ])
      setIsLoading(true)
      const response = await fetch("/api/text2measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          timeZoneOffset: getTimeZoneOffset(),
          utcDateTime: getUtcDateTime(),
        }),
      })
      const data = await response.json()
      setMessages((prevMessages) =>
        prevMessages
          .filter((msg) => msg.type !== "loading")
          .concat({ type: "response", text: JSON.stringify(data) })
      )
      setIsLoading(false)
      setInput("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <Shell>
      <DashboardHeader
        heading="Text to Measurements"
        text="Enter text containing measurements to extract them"
      />
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <div className="messages flex flex-col space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  message.type === "user"
                    ? "bg-blue-100 self-end"
                    : message.type === "response"
                    ? "bg-gray-100"
                    : ""
                }`}
              >
                {message.type === "loading" ? (
                  <SpinningLoader />
                ) : (
                  <pre className="whitespace-pre-wrap">{message.text}</pre>
                )}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter text with measurements..."
              className="flex-grow p-2 border rounded"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </Shell>
  )
} 