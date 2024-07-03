"use client"

import React, { useState } from "react"

import { getTimeZoneOffset, getUtcDateTime } from "@/lib/dateTimeWithTimezone"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"

// Define a type for the message objects
type Message = {
  type: "user" | "response" | "loading"
  text: string
}

const App: React.FC = () => {
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
        heading="Text 2 Measurements"
        text="Tell us what foods, medications, supplements you took or tell me about your symptoms and I'll convert it to structured data."
      />
      <div className="flex h-full flex-col">
        <div className="flex-grow overflow-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type} overflow-hidden break-all`}
            >
              {msg.type === "loading" ? (
                <div className="flex items-center justify-center">
                  <Icons.spinner className="animate-spin text-4xl" />{" "}
                </div>
              ) : (
                msg.text
              )}
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 left-0 right-0 flex bg-white">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="form-input mr-2 flex-grow border p-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </Shell>
  )
}

export default App
