import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import prisma from "@/lib/prisma"

import ProfileForm from "./ProfileForm"

export default async function ProfilePage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      userSkills: {
        include: {
          skill: true,
        },
      },
    },
  })

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}
