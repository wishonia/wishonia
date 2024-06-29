"use client"

import { GithubUser } from "@/lib/types"

import AssistantDisplay from "../AssistantDisplay"
import { Profile } from "./Profile"

export function ProfileList({ props: profiles }: { props: GithubUser[] }) {
  if (!Array.isArray(profiles)) {
    return []
  }
  if (profiles.length === 0) {
    return []
  }
  return (
    <AssistantDisplay>
      <div className="flex flex-col gap-2">
        {profiles.map((user: GithubUser, index) => {
          return <Profile key={index} props={user} isMultiple />
        })}
      </div>
    </AssistantDisplay>
  )
}
