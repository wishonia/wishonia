"use client"

import { FC } from "react"

import { GenericVariableSearch } from "@/components/genericVariables/generic-variable-search"

type UserVariableSearchProps = {
  user: {
    id: string
  }
}

export const UserVariableSearch: FC<UserVariableSearchProps> = ({
  user,
}: {
  user: any
}) => {
  return <GenericVariableSearch user={user} includePublic={false} />
}
