import React from 'react'

interface TimelineItemProps {
  year: number
  event: string
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ year, event }) => (
  <div className="flex mb-4 last:mb-0">
    <div className="flex flex-col items-center mr-4">
      <div className="w-3 h-3 bg-primary rounded-full" />
      <div className="w-px h-full bg-border" />
    </div>
    <div>
      <p className="font-bold">{year}</p>
      <p className="text-sm text-muted-foreground">{event}</p>
    </div>
  </div>
)

export const Timeline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="py-4">
    {children}
  </div>
)

