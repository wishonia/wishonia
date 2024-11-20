import { PetitionStatusUpdate } from "@prisma/client";

export function UpdatesTimeline({ updates }: { updates: PetitionStatusUpdate[] }) {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="border-l-2 border-gray-200 pl-4">
          <time className="text-sm text-gray-500">
            {new Date(update.createdAt).toLocaleDateString()}
          </time>
          <p className="mt-1">{update.content}</p>
        </div>
      ))}
    </div>
  )
} 