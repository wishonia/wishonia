import { env } from "@/env.mjs"
import { getUserById } from "@/lib/prisma/users"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const user = await getUser(params.id)

  if (!user) {
    return {
      title: "User not found",
    }
  }
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: `${user.name}'s profile`,
    description: `Welcome to ${user.name}'s profile page.`,
  }
}

async function getUser(id: string) {
  const { user } = await getUserById(id)
  if (!user) {
    throw new Error("Failed to fetch data")
  }

  return user
}

const User = async ({ params }: PageProps) => {
  const user = await getUser(params.id)

  return (
    <>
      <div className="container max-w-lg pb-20">
        <Card>
          <CardHeader>
            <CardTitle>{user.name as string}</CardTitle>
            <CardDescription>
              {user?.bio || "Wishonian Citizen"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              TODO: List signed wishes, referrer count, and other user details
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default User
