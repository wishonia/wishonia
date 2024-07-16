import React from "react"
import Image from "next/image"
import { User } from "next-auth"

interface QAItemProps {
  title: string
  description?: string
  visual?: string | React.ReactNode
  user?: User | undefined
}

export default function HowItWorksItem({ title, description, visual }: QAItemProps) {
  return (
      <div className="border-4">
        <div className="p-4">
          <p className="text-3xl font-bold">{title}</p>
        </div>
        {description && (
            <div className="p-4">
              <p className="text-2xl">{description}</p>
            </div>
        )}
        {visual && (
            <div className="flex-1 overflow-x-auto">
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
  )
}
