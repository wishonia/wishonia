import React from "react"
import Image from "next/image"
import { User } from "next-auth"

interface QAItemProps {
  question: string
  answer: string
  visual?: string | React.ReactNode
  user?: User | undefined
}

export default function QAItem({ question, answer, visual }: QAItemProps) {
  return (
    <div className="border-t-4 pt-4">
      <div className="border-4">
        <div className="p-4">
          <p className="text-3xl font-bold">{question}</p>
        </div>
        <div className="p-4">
          <p className="text-2xl">{answer}</p>
        </div>
        {visual && (
          <div className="flex-1">
            {typeof visual === "string" ? (
              <Image
                src={visual}
                alt="Visual aid"
                width={400}
                height={300}
                className="border-2"
              />
            ) : (
              visual
            )}
          </div>
        )}
      </div>
    </div>
  )
}
