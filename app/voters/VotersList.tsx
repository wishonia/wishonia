import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { siteConfig } from "@/config/site"
import { getUsersWithReferrerCount } from "@/lib/prisma/users"

export const getInitials = (name: string) => {
  const words = name.split(" ")
  if (words.length > 1) {
    return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`
  } else {
    return words[0].charAt(0)
  }
}

export async function VotersList() {
  const response = await getUsersWithReferrerCount()

  if ("error" in response) {
    return (
      <>
        <h1>Error fetching users</h1>
        <p>{String(response.error)}</p>
      </>
    )
  }

  const users = response.users
  if (users.length === 0) {
    return (
      <>
        <h1>No users</h1>
        <p>There are currently no voters to display.</p>
      </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voter Leaderboard</CardTitle>
        <CardDescription>Meet the fine citizens of {siteConfig.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {users?.map((user: any, id: number) => (
            <Link
              key={user.id}
              href={`/voters/${user.id}`}
              className="flex items-center justify-between space-x-4 rounded-md p-2 transition-all hover:bg-muted"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.image as string} />
                  <AvatarFallback className="uppercase">
                    {getInitials(user.firstName + " " + user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col overflow-hidden">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
                    {/*{user.jobTitle ? user.jobTitle : "Wishonian Citizen"}*/}
                    {"Got " + user.referralCount + " votes"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
